package com.stylehomes.service;

import com.stylehomes.model.Consultation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;
    
    @Value("${app.email.from}")
    private String fromEmail;
    
    @Value("${app.email.admin}")
    private String adminEmail;
    
    @Async
    public void sendConsultationConfirmation(Consultation consultation) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(consultation.getEmail());
            message.setSubject("Thank you for your consultation request - Style Homes");
            message.setText(buildConfirmationEmail(consultation));
            
            mailSender.send(message);
            log.info("Confirmation email sent to: {}", consultation.getEmail());
        } catch (Exception e) {
            log.error("Failed to send confirmation email to: {}", consultation.getEmail(), e);
        }
    }
    
    @Async
    public void sendAdminNotification(Consultation consultation) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(adminEmail);
            message.setSubject("New Consultation Request - Style Homes");
            message.setText(buildAdminNotificationEmail(consultation));
            
            mailSender.send(message);
            log.info("Admin notification email sent for consultation ID: {}", consultation.getId());
        } catch (Exception e) {
            log.error("Failed to send admin notification email", e);
        }
    }
    
    private String buildConfirmationEmail(Consultation consultation) {
        return String.format(
            "Dear %s %s,\n\n" +
            "Thank you for contacting Style Homes! We have received your consultation request and will contact you shortly.\n\n" +
            "Your request details:\n" +
            "- Project Type: %s\n" +
            "- Location: %s\n" +
            "- Estimated Budget: %s\n" +
            "- Preferred Timeline: %s\n\n" +
            "We will review your request and get back to you within 24-48 hours.\n\n" +
            "Best regards,\n" +
            "Style Homes Team",
            consultation.getFirstName(),
            consultation.getLastName(),
            consultation.getProjectType() != null ? consultation.getProjectType() : "Not specified",
            consultation.getProjectLocation() != null ? consultation.getProjectLocation() : "Not specified",
            consultation.getEstimatedBudget() != null ? consultation.getEstimatedBudget() : "Not specified",
            consultation.getPreferredTimeline() != null ? consultation.getPreferredTimeline() : "Not specified"
        );
    }
    
    private String buildAdminNotificationEmail(Consultation consultation) {
        return String.format(
            "New consultation request received:\n\n" +
            "Name: %s %s\n" +
            "Email: %s\n" +
            "Phone: %s\n" +
            "Project Type: %s\n" +
            "Location: %s\n" +
            "Budget: %s\n" +
            "Timeline: %s\n" +
            "Details: %s\n\n" +
            "Request ID: %d",
            consultation.getFirstName(),
            consultation.getLastName(),
            consultation.getEmail(),
            consultation.getPhone(),
            consultation.getProjectType() != null ? consultation.getProjectType() : "Not specified",
            consultation.getProjectLocation() != null ? consultation.getProjectLocation() : "Not specified",
            consultation.getEstimatedBudget() != null ? consultation.getEstimatedBudget() : "Not specified",
            consultation.getPreferredTimeline() != null ? consultation.getPreferredTimeline() : "Not specified",
            consultation.getProjectDetails(),
            consultation.getId()
        );
    }
}
