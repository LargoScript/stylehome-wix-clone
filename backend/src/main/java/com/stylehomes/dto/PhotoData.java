package com.stylehomes.dto;

import lombok.Data;

/**
 * DTO for receiving photo data from frontend.
 * Photos are sent as base64 encoded strings.
 */
@Data
public class PhotoData {
    /**
     * Original filename of the photo
     */
    private String filename;
    
    /**
     * MIME type (e.g., "image/jpeg", "image/png")
     */
    private String contentType;
    
    /**
     * Base64 encoded photo data (without data:... prefix)
     */
    private String data;
    
    /**
     * File size in bytes
     */
    private Long size;
}
