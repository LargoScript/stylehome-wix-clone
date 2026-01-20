package com.stylehomes.service;

import com.stylehomes.dto.ConsultationRequest;
import com.stylehomes.dto.PhotoData;
import com.stylehomes.model.Consultation;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;
    
    @Value("${app.email.from}")
    private String fromEmail;
    
    @Value("${app.email.admin}")
    private String adminEmail;
    
    /**
     * Send confirmation email to the customer (text only, no attachments)
     */
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
    
    /**
     * Send admin notification email WITH photo attachments
     */
    @Async
    public void sendAdminNotificationWithPhotos(Consultation consultation, List<PhotoData> photos) {
        try {
            if (photos == null || photos.isEmpty()) {
                // No photos - send simple text email
                sendSimpleAdminNotification(consultation);
                return;
            }
            
            // Create MimeMessage for attachments
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject("New Consultation Request (with photos) - Style Homes");
            helper.setText(buildAdminNotificationEmail(consultation, photos.size()));
            
            // Add photo attachments
            int photoIndex = 1;
            for (PhotoData photo : photos) {
                try {
                    byte[] photoBytes = Base64.getDecoder().decode(photo.getData());
                    String filename = photo.getFilename() != null ? photo.getFilename() : "photo_" + photoIndex + ".jpg";
                    String contentType = photo.getContentType() != null ? photo.getContentType() : "image/jpeg";
                    
                    helper.addAttachment(filename, new ByteArrayResource(photoBytes), contentType);
                    log.debug("Added attachment: {} ({} bytes)", filename, photoBytes.length);
                    photoIndex++;
                } catch (Exception e) {
                    log.error("Failed to add photo attachment: {}", photo.getFilename(), e);
                }
            }
            
            mailSender.send(mimeMessage);
            log.info("Admin notification email with {} photos sent for consultation ID: {}", photos.size(), consultation.getId());
            
        } catch (MessagingException e) {
            log.error("Failed to send admin notification email with attachments", e);
            // Fallback to simple email without attachments
            sendSimpleAdminNotification(consultation);
        }
    }
    
    /**
     * Send simple admin notification email (text only, no attachments)
     */
    @Async
    public void sendAdminNotification(Consultation consultation) {
        sendSimpleAdminNotification(consultation);
    }
    
    private void sendSimpleAdminNotification(Consultation consultation) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(adminEmail);
            message.setSubject("New Consultation Request - Style Homes");
            message.setText(buildAdminNotificationEmail(consultation, 0));
            
            mailSender.send(message);
            log.info("Admin notification email sent for consultation ID: {}", consultation.getId());
        } catch (Exception e) {
            log.error("Failed to send admin notification email", e);
        }
    }
    
    private String buildConfirmationEmail(Consultation consultation) {
        return String.format(
            """
            Dear %s %s,
            
            Thank you for contacting Style Homes! We have received your consultation request and will contact you shortly.
            
            Your request details:
            - Project Type: %s
            - Location: %s
            - Estimated Budget: %s
            - Preferred Timeline: %s
            
            We will review your request and get back to you within 24-48 hours.
            
            Best regards,
            Style Homes Team
            
            --
            Style Homes - Smart Investment • Quality Craftsmanship
            Website: https://stylehomesusa.com
            """,
            consultation.getFirstName(),
            consultation.getLastName() != null ? consultation.getLastName() : "",
            consultation.getProjectType() != null ? consultation.getProjectType() : "Not specified",
            consultation.getProjectLocation() != null ? consultation.getProjectLocation() : "Not specified",
            consultation.getEstimatedBudget() != null ? consultation.getEstimatedBudget() : "Not specified",
            consultation.getPreferredTimeline() != null ? consultation.getPreferredTimeline() : "Not specified"
        );
    }
    
    private String buildAdminNotificationEmail(Consultation consultation, int photoCount) {
        StringBuilder sb = new StringBuilder();
        sb.append("═══════════════════════════════════════════════════════════\n");
        sb.append("           NEW CONSULTATION REQUEST - STYLE HOMES\n");
        sb.append("═══════════════════════════════════════════════════════════\n\n");
        
        sb.append("📋 CUSTOMER INFORMATION:\n");
        sb.append("─────────────────────────────────────────────────────────\n");
        sb.append(String.format("Name:      %s %s\n", 
            consultation.getFirstName(), 
            consultation.getLastName() != null ? consultation.getLastName() : ""));
        sb.append(String.format("Email:     %s\n", consultation.getEmail()));
        sb.append(String.format("Phone:     %s\n", 
            consultation.getPhone() != null ? consultation.getPhone() : "Not provided"));
        sb.append("\n");
        
        sb.append("🏠 PROJECT DETAILS:\n");
        sb.append("─────────────────────────────────────────────────────────\n");
        sb.append(String.format("Type:      %s\n", 
            consultation.getProjectType() != null ? consultation.getProjectType() : "Not specified"));
        sb.append(String.format("Location:  %s\n", 
            consultation.getProjectLocation() != null ? consultation.getProjectLocation() : "Not specified"));
        sb.append(String.format("Budget:    %s\n", 
            consultation.getEstimatedBudget() != null ? consultation.getEstimatedBudget() : "Not specified"));
        sb.append(String.format("Timeline:  %s\n", 
            consultation.getPreferredTimeline() != null ? consultation.getPreferredTimeline() : "Not specified"));
        sb.append("\n");
        
        sb.append("📝 MESSAGE:\n");
        sb.append("─────────────────────────────────────────────────────────\n");
        sb.append(consultation.getProjectDetails());
        sb.append("\n\n");
        
        if (photoCount > 0) {
            sb.append("📷 ATTACHED PHOTOS: ").append(photoCount).append(" file(s)\n");
            sb.append("─────────────────────────────────────────────────────────\n");
            sb.append("Photos are attached to this email.\n\n");
        }
        
        sb.append("═══════════════════════════════════════════════════════════\n");
        sb.append(String.format("Request ID: #%d\n", consultation.getId()));
        sb.append(String.format("Received:   %s\n", consultation.getCreatedAt()));
        sb.append("═══════════════════════════════════════════════════════════\n");
        
        return sb.toString();
    }
}
