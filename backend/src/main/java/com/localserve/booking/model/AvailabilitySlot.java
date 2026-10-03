package com.localserve.booking.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "availability_slots")
public class AvailabilitySlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User provider;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private boolean booked = false;

    protected AvailabilitySlot() {}

    public AvailabilitySlot(User provider, LocalDateTime startTime, LocalDateTime endTime) {
        this.provider = provider;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getId() { return id; }
    public User getProvider() { return provider; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public boolean isBooked() { return booked; }
    public void setBooked(boolean booked) { this.booked = booked; }
}
