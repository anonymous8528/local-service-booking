package com.localserve.booking.dto;

import com.localserve.booking.dto.Dtos.*;
import com.localserve.booking.model.AvailabilitySlot;
import com.localserve.booking.model.Booking;
import com.localserve.booking.model.User;

public class Mapper {
    public static ProviderDto provider(User u) {
        return new ProviderDto(u.getId(), u.getName(), u.getCategory(), u.getCity(),
                u.getHourlyRate(), u.getBio());
    }

    public static SlotDto slot(AvailabilitySlot s) {
        return new SlotDto(s.getId(), s.getStartTime(), s.getEndTime(), s.isBooked());
    }

    public static BookingDto booking(Booking b) {
        AvailabilitySlot s = b.getSlot();
        return new BookingDto(b.getId(), s.getId(), s.getStartTime(), s.getEndTime(),
                s.getProvider().getName(), b.getCustomer().getName(), b.getNote(),
                b.getStatus(), b.getCreatedAt());
    }

    public static UserDto user(User u) {
        return new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getCategory(), u.getCity());
    }
}
