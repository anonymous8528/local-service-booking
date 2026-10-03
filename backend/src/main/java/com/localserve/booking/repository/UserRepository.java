package com.localserve.booking.repository;

import com.localserve.booking.model.Category;
import com.localserve.booking.model.Role;
import com.localserve.booking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByRoleAndCategory(Role role, Category category);
    long countByRole(Role role);
}
