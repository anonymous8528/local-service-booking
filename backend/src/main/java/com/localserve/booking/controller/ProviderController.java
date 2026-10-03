package com.localserve.booking.controller;

import com.localserve.booking.dto.Dtos.*;
import com.localserve.booking.dto.Mapper;
import com.localserve.booking.exception.ApiException;
import com.localserve.booking.model.Category;
import com.localserve.booking.model.Role;
import com.localserve.booking.repository.UserRepository;
import com.localserve.booking.service.SlotService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Public endpoints: anyone can browse providers and see free slots.
@RestController
@RequestMapping("/api/providers")
public class ProviderController {
    private final UserRepository users;
    private final SlotService slotService;

    public ProviderController(UserRepository users, SlotService slotService) {
        this.users = users;
        this.slotService = slotService;
    }

    @GetMapping
    public List<ProviderDto> list(@RequestParam(required = false) Category category) {
        var found = (category == null)
                ? users.findByRole(Role.PROVIDER)
                : users.findByRoleAndCategory(Role.PROVIDER, category);
        return found.stream().map(Mapper::provider).toList();
    }

    @GetMapping("/{id}")
    public ProviderDto one(@PathVariable Long id) {
        return users.findById(id)
                .filter(u -> u.getRole() == Role.PROVIDER)
                .map(Mapper::provider)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Provider not found"));
    }

    @GetMapping("/{id}/slots")
    public List<SlotDto> slots(@PathVariable Long id) {
        return slotService.openSlots(id);
    }
}
