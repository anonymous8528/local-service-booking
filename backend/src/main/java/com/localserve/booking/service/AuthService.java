package com.localserve.booking.service;

import com.localserve.booking.dto.Dtos.*;
import com.localserve.booking.exception.ApiException;
import com.localserve.booking.model.Role;
import com.localserve.booking.model.User;
import com.localserve.booking.repository.UserRepository;
import com.localserve.booking.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public AuthResponse register(RegisterRequest r) {
        if (r.role() == Role.ADMIN) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Admin accounts cannot be created here");
        }
        String email = r.email().trim().toLowerCase();
        if (users.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "This email is already registered");
        }
        if (r.role() == Role.PROVIDER && r.category() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Providers must choose a category");
        }

        User u = new User();
        u.setName(r.name().trim());
        u.setEmail(email);
        u.setPassword(encoder.encode(r.password()));
        u.setRole(r.role());
        if (r.role() == Role.PROVIDER) {
            u.setCategory(r.category());
            u.setCity(r.city());
            u.setHourlyRate(r.hourlyRate());
            u.setBio(r.bio());
        }
        users.save(u);
        return toResponse(u);
    }

    public AuthResponse login(LoginRequest r) {
        User u = users.findByEmail(r.email().trim().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Wrong email or password"));
        if (!encoder.matches(r.password(), u.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Wrong email or password");
        }
        return toResponse(u);
    }

    private AuthResponse toResponse(User u) {
        return new AuthResponse(jwt.generate(u.getEmail(), u.getRole().name()),
                u.getId(), u.getName(), u.getEmail(), u.getRole());
    }
}
