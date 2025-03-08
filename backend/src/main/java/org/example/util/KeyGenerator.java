package org.example.util;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import org.jboss.logging.Logger;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

/**
 * Utility class to generate and manage RSA keys for JWT signing and verification
 */
@ApplicationScoped
public class KeyGenerator {

    private static final Logger LOGGER = Logger.getLogger(KeyGenerator.class);
    private static final String PRIVATE_KEY_FILE = "privateKey.pem";
    private static final String PUBLIC_KEY_FILE = "publicKey.pem";

    /**
     * Generate RSA keys on application startup if they don't exist
     */
    public void onStartup(@Observes StartupEvent event) {
        try {
            if (!keysExist()) {
                generateKeys();
            } else {
                LOGGER.info("RSA keys already exist, using existing keys");
            }
        } catch (Exception e) {
            LOGGER.errorf("Failed to initialize RSA keys: %s", e.getMessage());
            throw new RuntimeException("Failed to initialize RSA keys", e);
        }
    }

    /**
     * Check if key files already exist
     * @return true if both private and public key files exist
     */
    private boolean keysExist() {
        Path privateKeyPath = Paths.get(PRIVATE_KEY_FILE);
        Path publicKeyPath = Paths.get(PUBLIC_KEY_FILE);
        return Files.exists(privateKeyPath) && Files.exists(publicKeyPath);
    }

    /**
     * Generate new RSA key pair and save to files
     * @throws Exception if key generation or saving fails
     */
    private void generateKeys() throws Exception {
        LOGGER.info("Generating new RSA key pair for JWT signing/verification");

        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(2048);
        KeyPair keyPair = keyPairGenerator.generateKeyPair();

        // Save private key
        PrivateKey privateKey = keyPair.getPrivate();
        savePrivateKey(privateKey);

        // Save public key
        PublicKey publicKey = keyPair.getPublic();
        savePublicKey(publicKey);

        LOGGER.info("RSA key pair generated and saved successfully");
    }

    /**
     * Save private key to PEM file
     * @param privateKey The private key to save
     * @throws IOException if saving fails
     */
    private void savePrivateKey(PrivateKey privateKey) throws IOException {
        PKCS8EncodedKeySpec pkcs8EncodedKeySpec = new PKCS8EncodedKeySpec(privateKey.getEncoded());
        String encodedPrivateKey = Base64.getEncoder().encodeToString(pkcs8EncodedKeySpec.getEncoded());

        File privateKeyFile = new File(PRIVATE_KEY_FILE);
        try (FileOutputStream fos = new FileOutputStream(privateKeyFile)) {
            fos.write("-----BEGIN PRIVATE KEY-----\n".getBytes());
            for (int i = 0; i < encodedPrivateKey.length(); i += 64) {
                fos.write(encodedPrivateKey.substring(i, Math.min(i + 64, encodedPrivateKey.length())).getBytes());
                fos.write('\n');
            }
            fos.write("-----END PRIVATE KEY-----\n".getBytes());
        }

        // Set restrictive permissions (owner read-only)
        privateKeyFile.setReadable(false, false);
        privateKeyFile.setReadable(true, true);
        privateKeyFile.setWritable(false, false);
    }

    /**
     * Save public key to PEM file
     * @param publicKey The public key to save
     * @throws IOException if saving fails
     */
    private void savePublicKey(PublicKey publicKey) throws IOException {
        X509EncodedKeySpec x509EncodedKeySpec = new X509EncodedKeySpec(publicKey.getEncoded());
        String encodedPublicKey = Base64.getEncoder().encodeToString(x509EncodedKeySpec.getEncoded());

        try (FileOutputStream fos = new FileOutputStream(PUBLIC_KEY_FILE)) {
            fos.write("-----BEGIN PUBLIC KEY-----\n".getBytes());
            for (int i = 0; i < encodedPublicKey.length(); i += 64) {
                fos.write(encodedPublicKey.substring(i, Math.min(i + 64, encodedPublicKey.length())).getBytes());
                fos.write('\n');
            }
            fos.write("-----END PUBLIC KEY-----\n".getBytes());
        }
    }
}
