package com.neovesta.backend.services;

import java.io.IOException;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
@Transactional
public class SupabaseStorageService {

    private static final Logger logger = LoggerFactory.getLogger(SupabaseStorageService.class);

    private final String supabaseUrl;
    private final String supabaseKey;
    private final String bucketName;

    public SupabaseStorageService(
            @Value("${app.cloud.supabase.url}") String supabaseUrl,
            @Value("${app.cloud.supabase.key}") String supabaseKey,
            @Value("${app.cloud.supabase.bucket}") String bucketName) {

        this.supabaseUrl = supabaseUrl;
        this.supabaseKey = supabaseKey;
        this.bucketName = bucketName;
    }

    public String uploadDocument(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide");
        }

        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename()
                .replace(" ", "_") 
                .replaceAll("[^a-zA-Z0-9.-]", ""); 

        OkHttpClient client = new OkHttpClient.Builder()
                .build();

        RequestBody body = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("file", fileName,
                        RequestBody.create(file.getBytes(),
                                MediaType.parse(file.getContentType() != null ? file.getContentType()
                                        : "application/octet-stream")))
                .build();

        Request request = new Request.Builder()
                .url(supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName)
                .post(body)
                .addHeader("Authorization", "Bearer " + supabaseKey)
                .addHeader("Content-Type", "multipart/form-data")
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Aucun corps de réponse";
                logger.error("Échec de l'upload Supabase. Code: {}, Erreur: {}",
                        response.code(), errorBody);
                throw new IOException("Échec de l'upload. Code: " + response.code() +
                        ", Message: " + errorBody);
            }

            String publicUrl = supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + fileName;

            logger.info("Fichier uploadé avec succès : {}", publicUrl);
            return publicUrl;
        } catch (Exception e) {
            logger.error("Erreur lors de l'upload du fichier", e);
            throw new IOException("Erreur lors de l'upload du fichier", e);
        }
    }



    public void deleteDocumentByUrl(String url) throws IOException {
        String fileName = url.substring(url.lastIndexOf('/') + 1);
        deleteDocument(fileName);
    }

    public void deleteDocument(String fileName) throws IOException {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url(supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName)
                .delete()
                .addHeader("Authorization", "Bearer " + supabaseKey)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Delete failed. Code: " + response.code()
                        + ", Message: " + (response.body() != null ? response.body().string() : ""));
            }
            logger.info("Deleted document: {}", fileName);
        }
    }
}