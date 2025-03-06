package com.neovesta.backend.services;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${app.cloud.cloudinary.cloud-name}") String cloudName,
            @Value("${app.cloud.cloudinary.api-key}") String apiKey,
            @Value("${app.cloud.cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
    }

    public List<String> uploadImages(List<MultipartFile> images) throws IOException {
        return images.stream()
                .map(image -> {
                    try {
                        Map<?, ?> uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());
                        return uploadResult.get("secure_url").toString();
                    } catch (IOException e) {
                        throw new RuntimeException("Image upload failed", e);
                    }
                })
                .collect(Collectors.toList());
    }

    // CloudinaryService.java
    public void deleteImages(List<String> imageUrls) {
        imageUrls.parallelStream().forEach(url -> {
            try {
                String publicId = extractPublicIdFromUrl(url);
                Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                log.info("Deleted image: {} - Result: {}", publicId, result.get("result"));
            } catch (IOException e) {
                log.error("Error deleting image: {}", url, e);
                throw new RuntimeException("Error deleting image", e);
            }
        });
    }

    // @Override
    public String uploadImage(MultipartFile image) throws IOException {
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file cannot be null or empty");
        }
        
        Map<?, ?> uploadResult = cloudinary.uploader().upload(
            image.getBytes(), 
            ObjectUtils.asMap(
                "resource_type", "auto",
                "folder", "neovesta/features"
            )
        );
        
        return uploadResult.get("url").toString();
    }

    // @Override
    public void deleteImage(String imageUrl) throws IOException {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }
        
        // Extract public_id from URL
        String publicId = extractPublicIdFromUrl(imageUrl);
        
        if (publicId != null) {
            cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.emptyMap()
            );
            log.info("Deleted image with public ID: {}", publicId);
        }
    }
    private String extractPublicIdFromUrl(String url) {
        try {
            URI uri = new URI(url);
            String path = uri.getPath();
            String[] parts = path.split("/upload/");
            if (parts.length > 1) {
                String fullPath = parts[1];
                return fullPath.replaceFirst("v\\d+/", "").split("\\.")[0];
            }
            throw new IllegalArgumentException("Invalid Cloudinary URL");
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("Invalid URL", e);
        }
    }
}
