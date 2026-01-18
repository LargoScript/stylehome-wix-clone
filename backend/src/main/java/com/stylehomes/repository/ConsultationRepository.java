package com.stylehomes.repository;

import com.stylehomes.model.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByStatusOrderByCreatedAtDesc(String status);
    List<Consultation> findAllByOrderByCreatedAtDesc();
}
