package com.rayoshop.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rayoshop.backend.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
