package com.localserve.booking.repository;

import com.localserve.booking.model.Booking;
import com.localserve.booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Booking> findBySlot_Provider_IdOrderByCreatedAtDesc(Long providerId);
    List<Booking> findAllByOrderByCreatedAtDesc();
    long countByStatus(BookingStatus status);
}
