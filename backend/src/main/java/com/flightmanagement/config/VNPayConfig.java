package com.flightmanagement.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

/**
 * Configuration for VNPAY payment gateway
 */
@Component
@Configuration
public class VNPayConfig {

    @Value("${vnpay.pay-url}")
    private String payUrl;

    @Value("${vnpay.return-url}")
    private String returnUrl;

    @Value("${vnpay.tmn-code}")
    private String tmnCode;

    @Value("${vnpay.secret-key}")
    private String secretKey;

    @Value("${vnpay.api-url}")
    private String apiUrl;

    // Public configuration properties
    public static String vnp_PayUrl;
    public static String vnp_ReturnUrl;
    public static String vnp_TmnCode;
    public static String vnp_ApiUrl;
    
    // Private instance reference to avoid static access to sensitive data
    private static VNPayConfig instance;

    // Initialize static fields after Spring has injected the values
    @PostConstruct
    public void init() {
        vnp_PayUrl = payUrl;
        vnp_ReturnUrl = returnUrl;
        vnp_TmnCode = tmnCode;
        vnp_ApiUrl = apiUrl;
        
        // Store instance for controlled access to sensitive data
        instance = this;
        
        // Log non-sensitive initialization only
        System.out.println("✓ VNPAY payment gateway initialized");
    }

    /**
     * Generate HMAC_SHA512 signature with proper key handling
     * @param data The data to sign
     * @return The signature
     */
    public static String generateHmacSHA512Signature(final String data) {
        if (instance == null || data == null) {
            throw new IllegalStateException("VNPay configuration not initialized or data is null");
        }
        return hmacSHA512(instance.secretKey, data);
    }

    public static String md5(String message) {
        String digest;
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            digest = getDigest(message, md);
        } catch (UnsupportedEncodingException | NoSuchAlgorithmException ex) {
            digest = "";
        }
        return digest;
    }

    public static String Sha256(String message) {
        String digest;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            digest = getDigest(message, md);
        } catch (UnsupportedEncodingException | NoSuchAlgorithmException ex) {
            digest = "";
        }
        return digest;
    }

    private static String getDigest(String message, MessageDigest md) throws UnsupportedEncodingException {
        String digest;
        byte[] hash = md.digest(message.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            sb.append(String.format("%02x", b & 0xff));
        }
        digest = sb.toString();
        return digest;
    }

    //Util for VNPAY
    public static String hashAllFields(Map<String, String> fields) {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                sb.append(fieldName);
                sb.append("=");
                sb.append(fieldValue);
            }
            if (itr.hasNext()) {
                sb.append("&");
            }
        }
        return generateHmacSHA512Signature(sb.toString());
    }

    // Keep as private static to limit exposure
    private static String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception ex) {
            return "";
        }
    }

    public static String getIpAddress(HttpServletRequest request) {
        String ipAdress;
        try {
            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress == null) {
                ipAdress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAdress = "Invalid IP:" + e.getMessage();
        }
        return ipAdress;
    }

    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}