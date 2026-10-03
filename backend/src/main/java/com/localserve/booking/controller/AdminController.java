package com.localserve.booking.controller;

import com.localserve.booking.dto.Dtos.*;
import com.localserve.booking.dto.Mapper;
import com.localserve.booking.model.BookingStatus;
import com.localserve.booking.model.Role;
import com.localserve.booking.repository.BookingRepository;
import com.localserve.booking.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Admin-only area
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository users;
    private final BookingRepository bookings;

    public AdminController(UserRepository users, BookingRepository bookings) {
        this.users = users;
        this.bookings = bookings;
    }

    @GetMapping("/stats")
    public StatsDto stats() {
        return new StatsDto(users.count(), users.countByRole(Role.PROVIDER),
                bookings.count(), bookings.countByStatus(BookingStatus.BOOKED));
    }

    @GetMapping("/users")
    public List<UserDto> allUsers() {
        return users.findAll().stream().map(Mapper::user).toList();
    }

    @GetMapping("/bookings")
    public List<BookingDto> allBookings() {
        return bookings.findAllByOrderByCreatedAtDesc().stream().map(Mapper::booking).toList();
    }
}
