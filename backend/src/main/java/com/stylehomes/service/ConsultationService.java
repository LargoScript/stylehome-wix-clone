package com.stylehomes.service;

import com.stylehomes.dto.ConsultationRequest;
import com.stylehomes.dto.ConsultationResponse;
import com.stylehomes.model.Consultation;
import com.stylehomes.repository.ConsultationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConsultationService {
    private final ConsultationRepository consultationRepository;
    private final EmailService emailService;
    
    @Transactional
    public ConsultationResponse createConsultation(ConsultationRequest request) {
        Consultation consultation = new Consultation();
        consultation.setFirstName(request.getFirstName());
        consultation.setLastName(request.getLastName());
        consultation.setEmail(request.getEmail());
        consultation.setPhone(request.getPhone());
        consultation.setProjectType(request.getProjectType());
        consultation.setProjectLocation(request.getProjectLocation());
        consultation.setEstimatedBudget(request.getEstimatedBudget());
        consultation.setPreferredTimeline(request.getPreferredTimeline());
        consultation.setProjectDetails(request.getProjectDetails());
        consultation.setStatus("NEW");
        
        Consultation saved = consultationRepository.save(consultation);
        log.info("Created consultation with ID: {}", saved.getId());
        
        // Send email notifications
        emailService.sendConsultationConfirmation(saved);
        emailService.sendAdminNotification(saved);
        
        return mapToResponse(saved);
    }
    
    public List<ConsultationResponse> getAllConsultations() {
        return consultationRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public ConsultationResponse getConsultationById(Long id) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found with id: " + id));
        return mapToResponse(consultation);
    }
    
    @Transactional
    public ConsultationResponse updateConsultationStatus(Long id, String status) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found with id: " + id));
        consultation.setStatus(status);
        Consultation updated = consultationRepository.save(consultation);
        return mapToResponse(updated);
    }
    
    @Transactional
    public void deleteConsultation(Long id) {
        consultationRepository.deleteById(id);
        log.info("Deleted consultation with ID: {}", id);
    }
    
    private ConsultationResponse mapToResponse(Consultation consultation) {
        ConsultationResponse response = new ConsultationResponse();
        response.setId(consultation.getId());
        response.setFirstName(consultation.getFirstName());
        response.setLastName(consultation.getLastName());
        response.setEmail(consultation.getEmail());
        response.setPhone(consultation.getPhone());
        response.setProjectType(consultation.getProjectType());
        response.setProjectLocation(consultation.getProjectLocation());
        response.setEstimatedBudget(consultation.getEstimatedBudget());
        response.setPreferredTimeline(consultation.getPreferredTimeline());
        response.setProjectDetails(consultation.getProjectDetails());
        response.setStatus(consultation.getStatus());
        response.setCreatedAt(consultation.getCreatedAt());
        response.setUpdatedAt(consultation.getUpdatedAt());
        return response;
    }
}
