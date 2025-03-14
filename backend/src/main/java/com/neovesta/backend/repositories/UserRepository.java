package com.neovesta.backend.repositories;

import com.neovesta.backend.models.User;
import com.neovesta.backend.models.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByResetToken(String resetToken);

    Page<User> findByRole(Role role, Pageable pageable);

    Page<User> findByStatus(boolean status, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'RESIDENT' and u.id= :userId and u.status = true")
    Optional<User> findResidentById(@Param("userId") UUID userId);

    @Query("SELECT u FROM User u WHERE " +
       "(LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
       "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
       "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
Page<User> searchUsers(@Param("searchTerm") String searchTerm, Pageable pageable);

    // @Query("SELECT u FROM User u WHERE " +
    //         "(:searchTerm IS NULL OR " +
    //         "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
    //         "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
    //         "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    // Page<User> searchUsers(

    //         @Param("searchTerm") String searchTerm,
    //         Pageable pageable);

    Page<User> findAll(Specification<User> spec, Pageable pageable);
}