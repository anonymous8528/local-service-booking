package com.localserve.booking.service;

import com.localserve.booking.dto.Dtos.*;
import com.localserve.booking.dto.Mapper;
import com.localserve.booking.exception.ApiException;
import com.localserve.booking.model.*;
import com.localserve.booking.repository.BookingRepository;
import com.localserve.booking.repository.SlotRepository;
import com.localserve.booking.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class BookingService {
    private static final DateTimeFormatter WHEN = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    private final BookingRepository bookings;
    private final SlotRepository slots;
    private final UserRepository users;
    private final EmailService email;

    public BookingService(BookingRepository bookings, SlotRepository slots,
                          UserRepository users, EmailService email) {
        this.bookings = bookings;
        this.slots = slots;
        this.users = users;
        this.email = email;
    }

    /**
     * THE IMPORTANT METHOD: slot conflict prevention.
     * 1. Everything runs in one transaction.
     * 2. findByIdForUpdate() locks the slot row (SELECT ... FOR UPDATE).
     *    If two customers click "Book" at the same moment, the second one waits here.
     * 3. After the first commits, the second reads booked = true and gets a 409 error.
     */
    @Transactional
    public BookingDto book(String customerEmail, BookingRequest req) {
        User customer = userByEmail(customerEmail);
        AvailabilitySlot slot = slots.findByIdForUpdate(req.slotId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Slot not found"));

        if (slot.isBooked()) {
            throw new ApiException(HttpStatus.CONFLICT, "Sorry, someone just booked this slot. Please pick another time.");
        }
        if (slot.getStartTime().isBefore(LocalDateTime.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "This slot is in the past");
        }

        slot.setBooked(true);
        Booking booking = bookings.save(new Booking(slot, customer, req.note()));

        String when = slot.getStartTime().format(WHEN);
        User provider = slot.getProvider();
        email.send(customer.getEmail(), "Booking confirmed",
                "Hi " + customer.getName() + ", your booking with " + provider.getName() + " on " + when + " is confirmed.");
        email.send(provider.getEmail(), "New booking",
                customer.getName() + " booked you on " + when + ".");
        return Mapper.booking(booking);
    }

    @Transactional
    public BookingDto cancel(String customerEmail, Long bookingId) {
        User customer = userByEmail(customerEmail);
        Booking booking = bookings.findById(bookingId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found"));
        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "This is not your booking");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ApiException(HttpStatus.CONFLICT, "Already cancelled");
        }

        // Lock the slot again so cancel and book cannot interleave.
        AvailabilitySlot slot = slots.findByIdForUpdate(booking.getSlot().getId()).orElseThrow();
        slot.setBooked(false);
        booking.setStatus(BookingStatus.CANCELLED);

        String when = slot.getStartTime().format(WHEN);
        email.send(slot.getProvider().getEmail(), "Booking cancelled",
                customer.getName() + " cancelled the booking on " + when + ". The slot is open again.");
        return Mapper.booking(booking);
    }

    public List<BookingDto> forCustomer(String customerEmail) {
        return bookings.findByCustomerIdOrderByCreatedAtDesc(userByEmail(customerEmail).getId())
                .stream().map(Mapper::booking).toList();
    }

    public List<BookingDto> forProvider(String providerEmail) {
        return bookings.findBySlot_Provider_IdOrderByCreatedAtDesc(userByEmail(providerEmail).getId())
                .stream().map(Mapper::booking).toList();
    }

    private User userByEmail(String email) {
        return users.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Please log in again"));
    }
}
