package com.localserve.booking.controller;

import com.localserve.booking.dto.Dtos.*;
import com.localserve.booking.service.BookingService;
import com.localserve.booking.service.SlotService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Provider-only area (SecurityConfig requires ROLE_PROVIDER for /api/dashboard/**)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final SlotService slotService;
    private final BookingService bookingService;

    public DashboardController(SlotService slotService, BookingService bookingService) {
        this.slotService = slotService;
        this.bookingService = bookingService;
    }

    @GetMapping("/slots")
    public List<SlotDto> mySlots(Authentication auth) {
        return slotService.mySlots(auth.getName());
    }

    @PostMapping("/slots")
    public SlotDto addSlot(Authentication auth, @Valid @RequestBody SlotRequest req) {
        return slotService.create(auth.getName(), req);
    }

    @DeleteMapping("/slots/{id}")
    public void deleteSlot(Authentication auth, @PathVariable Long id) {
        slotService.delete(auth.getName(), id);
    }

    @GetMapping("/bookings")
    public List<BookingDto> myBookings(Authentication auth) {
        return bookingService.forProvider(auth.getName());
    }
}
