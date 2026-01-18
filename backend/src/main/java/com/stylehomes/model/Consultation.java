package com.stylehomes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "consultations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    
    @Column(nullable = false, length = 255)
    private String email;
    
    @Column(nullable = false, length = 20)
    private String phone;
    
    @Column(name = "project_type", length = 50)
    private String projectType;
    
    @Column(name = "project_location", length = 255)
    private String projectLocation;
    
    @Column(name = "estimated_budget", length = 50)
    private String estimatedBudget;
    
    @Column(name = "preferred_timeline", length = 50)
    private String preferredTimeline;
    
    @Column(name = "project_details", columnDefinition = "TEXT")
    private String projectDetails;
    
    @Column(length = 20)
    private String status = "NEW";
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
