package com.localserve.booking.service;

import com.localserve.booking.dto.Dtos.*;
import com.localserve.booking.dto.Mapper;
import com.localserve.booking.exception.ApiException;
import com.localserve.booking.model.AvailabilitySlot;
import com.localserve.booking.model.Role;
import com.localserve.booking.model.User;
import com.localserve.booking.repository.SlotRepository;
import com.localserve.booking.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SlotService {
    private final SlotRepository slots;
    private final UserRepository users;

    public SlotService(SlotRepository slots, UserRepository users) {
        this.slots = slots;
        this.users = users;
    }

    // Public: free, future slots of one provider (what customers see)
    public List<SlotDto> openSlots(Long providerId) {
        ensureProvider(providerId);
        return slots.findByProviderIdAndBookedFalseAndStartTimeAfterOrderByStartTime(providerId, LocalDateTime.now())
                .stream().map(Mapper::slot).toList();
    }

    // Provider dashboard: all of my slots
    public List<SlotDto> mySlots(String email) {
        return slots.findByProviderIdOrderByStartTime(userByEmail(email).getId())
                .stream().map(Mapper::slot).toList();
    }

    @Transactional
    public SlotDto create(String email, SlotRequest req) {
        User provider = userByEmail(email);
        if (!req.endTime().isAfter(req.startTime())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "End time must be after start time");
        }
        if (req.startTime().isBefore(LocalDateTime.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Slot must start in the future");
        }
        if (slots.existsOverlap(provider.getId(), req.startTime(), req.endTime())) {
            throw new ApiException(HttpStatus.CONFLICT, "This overlaps with one of your existing slots");
        }
        return Mapper.slot(slots.save(new AvailabilitySlot(provider, req.startTime(), req.endTime())));
    }

    @Transactional
    public void delete(String email, Long slotId) {
        User provider = userByEmail(email);
        AvailabilitySlot slot = slots.findByIdForUpdate(slotId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Slot not found"));
        if (!slot.getProvider().getId().equals(provider.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "This is not your slot");
        }
        if (slot.isBooked()) {
            throw new ApiException(HttpStatus.CONFLICT, "A customer has booked this slot");
        }
        slots.delete(slot);
    }

    private void ensureProvider(Long id) {
        users.findById(id)
                .filter(u -> u.getRole() == Role.PROVIDER)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Provider not found"));
    }

    private User userByEmail(String email) {
        return users.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Please log in again"));
    }
}
