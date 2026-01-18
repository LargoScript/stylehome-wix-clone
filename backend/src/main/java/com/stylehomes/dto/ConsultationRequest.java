package com.stylehomes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ConsultationRequest {
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[\\d\\s\\-\\(\\)\\+]+$", message = "Invalid phone number format")
    private String phone;
    
    private String projectType;
    
    private String projectLocation;
    
    private String estimatedBudget;
    
    private String preferredTimeline;
    
    @NotBlank(message = "Project details are required")
    private String projectDetails;
}
