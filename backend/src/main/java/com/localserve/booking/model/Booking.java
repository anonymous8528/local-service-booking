package com.localserve.booking.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private AvailabilitySlot slot;

    @ManyToOne(optional = false)
    private User customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.BOOKED;

    @Column(length = 500)
    private String note;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    protected Booking() {}

    public Booking(AvailabilitySlot slot, User customer, String note) {
        this.slot = slot;
        this.customer = customer;
        this.note = note;
    }

    public Long getId() { return id; }
    public AvailabilitySlot getSlot() { return slot; }
    public User getCustomer() { return customer; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public String getNote() { return note; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
