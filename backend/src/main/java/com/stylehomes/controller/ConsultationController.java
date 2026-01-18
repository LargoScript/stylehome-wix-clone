package com.stylehomes.controller;

import com.stylehomes.dto.ConsultationRequest;
import com.stylehomes.dto.ConsultationResponse;
import com.stylehomes.service.ConsultationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consultations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConsultationController {
    private final ConsultationService consultationService;
    
    @PostMapping
    public ResponseEntity<ConsultationResponse> createConsultation(
            @Valid @RequestBody ConsultationRequest request) {
        ConsultationResponse response = consultationService.createConsultation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping
    public ResponseEntity<List<ConsultationResponse>> getAllConsultations() {
        List<ConsultationResponse> consultations = consultationService.getAllConsultations();
        return ResponseEntity.ok(consultations);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ConsultationResponse> getConsultationById(@PathVariable Long id) {
        ConsultationResponse consultation = consultationService.getConsultationById(id);
        return ResponseEntity.ok(consultation);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<ConsultationResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        ConsultationResponse updated = consultationService.updateConsultationStatus(id, status);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
        return ResponseEntity.noContent().build();
    }
}
