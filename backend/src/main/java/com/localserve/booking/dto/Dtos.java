package com.localserve.booking.dto;

import com.localserve.booking.model.BookingStatus;
import com.localserve.booking.model.Category;
import com.localserve.booking.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

// Data Transfer Objects: the exact JSON shapes the API accepts and returns.
// We never return entities directly, so the password hash can never leak.
public class Dtos {

    public record RegisterRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6) String password,
            @NotNull Role role,
            Category category,
            String city,
            Double hourlyRate,
            String bio) {}

    public record LoginRequest(@NotBlank String email, @NotBlank String password) {}

    public record AuthResponse(String token, Long id, String name, String email, Role role) {}

    public record ProviderDto(Long id, String name, Category category, String city,
                              Double hourlyRate, String bio) {}

    public record SlotRequest(@NotNull LocalDateTime startTime, @NotNull LocalDateTime endTime) {}

    public record SlotDto(Long id, LocalDateTime startTime, LocalDateTime endTime, boolean booked) {}

    public record BookingRequest(@NotNull Long slotId, @Size(max = 500) String note) {}

    public record BookingDto(Long id, Long slotId, LocalDateTime startTime, LocalDateTime endTime,
                             String providerName, String customerName, String note,
                             BookingStatus status, LocalDateTime createdAt) {}

    public record UserDto(Long id, String name, String email, Role role, Category category, String city) {}

    public record StatsDto(long users, long providers, long bookings, long activeBookings) {}
}
