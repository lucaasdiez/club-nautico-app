package com.clubNautico.service.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // 1. ESTA ES TU "PALABRA SECRETA".
    // TIENE QUE SER LARGA Y COMPLEJA.
    // Podés generarla en una web de "base64 generator".
    // ¡NUNCA la compartas!
    private static final String SECRET_KEY = "Y29tLmNsdWJOYXV0aWNvLnNlY3JldC5rZXkuZm9yLmp3dC5hdXRoZW50aWNhdGlvbg==";

    // --- MÉTODOS PARA GENERAR UN TOKEN ---

    /**
     * Genera un token JWT para el usuario.
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername()) // El "dueño" del token
                .issuedAt(new Date(System.currentTimeMillis())) // Fecha de creación
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 1 día de expiración
                .signWith(getSignInKey(), Jwts.SIG.HS256) // Firma con la llave secreta
                .compact();
    }

    // --- MÉTODOS PARA VALIDAR UN TOKEN ---

    /**
     * Verifica si un token es válido (no expiró y la firma es correcta).
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extrae el nombre de usuario (el "subject") del token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // --- MÉTODOS GENÉRICOS DE LECTURA ---

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // --- MÉTODOS INTERNOS (LLAVE) ---

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}