package com.rayoshop.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rayoshop.backend.models.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
