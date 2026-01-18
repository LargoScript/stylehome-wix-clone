package com.stylehomes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String projectType;
    private String projectLocation;
    private String estimatedBudget;
    private String preferredTimeline;
    private String projectDetails;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
