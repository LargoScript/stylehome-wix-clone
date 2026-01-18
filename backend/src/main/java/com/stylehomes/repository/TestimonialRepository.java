package com.stylehomes.repository;

import com.stylehomes.model.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    List<Testimonial> findByIsApprovedTrueOrderByCreatedAtDesc();
    List<Testimonial> findAllByOrderByCreatedAtDesc();
}
