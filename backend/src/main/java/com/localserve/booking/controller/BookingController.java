package com.localserve.booking.controller;

import com.localserve.booking.dto.Dtos.*;
import com.localserve.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Customer-only area
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public BookingDto book(Authentication auth, @Valid @RequestBody BookingRequest req) {
        return bookingService.book(auth.getName(), req);
    }

    @GetMapping("/my")
    public List<BookingDto> mine(Authentication auth) {
        return bookingService.forCustomer(auth.getName());
    }

    @PatchMapping("/{id}/cancel")
    public BookingDto cancel(Authentication auth, @PathVariable Long id) {
        return bookingService.cancel(auth.getName(), id);
    }
}
