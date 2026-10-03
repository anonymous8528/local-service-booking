package com.localserve.booking.repository;

import com.localserve.booking.model.AvailabilitySlot;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SlotRepository extends JpaRepository<AvailabilitySlot, Long> {

    List<AvailabilitySlot> findByProviderIdOrderByStartTime(Long providerId);

    List<AvailabilitySlot> findByProviderIdAndBookedFalseAndStartTimeAfterOrderByStartTime(
            Long providerId, LocalDateTime after);

    // Two time ranges overlap when: existing.start < new.end AND existing.end > new.start
    @Query("select count(s) > 0 from AvailabilitySlot s " +
           "where s.provider.id = :providerId and s.startTime < :end and s.endTime > :start")
    boolean existsOverlap(@Param("providerId") Long providerId,
                          @Param("start") LocalDateTime start,
                          @Param("end") LocalDateTime end);

    // SELECT ... FOR UPDATE: other transactions wait here until we commit.
    // This is what prevents two customers from booking the same slot.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from AvailabilitySlot s where s.id = :id")
    Optional<AvailabilitySlot> findByIdForUpdate(@Param("id") Long id);
}
