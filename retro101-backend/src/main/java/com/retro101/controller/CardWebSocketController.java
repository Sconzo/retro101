package com.retro101.controller;

import com.retro101.dto.CardBroadcastMessage;
import com.retro101.dto.CardCreateMessage;
import com.retro101.dto.CardDeleteMessage;
import com.retro101.dto.CardUpdateMessage;
import com.retro101.model.Card;
import com.retro101.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
@RequiredArgsConstructor
@Slf4j
public class CardWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final CardService cardService;

    // Rate limiting: Track card creation timestamps per participant
    private final java.util.concurrent.ConcurrentHashMap<String, java.util.concurrent.ConcurrentLinkedQueue<Long>> rateLimitMap =
            new java.util.concurrent.ConcurrentHashMap<>();
    private static final int MAX_CARDS_PER_SECOND = 10;
    private static final long ONE_SECOND_MS = 1000L;

    @MessageMapping("/card.create")
    public void createCard(@Valid @Payload CardCreateMessage message) {
        log.info("Received card create message: roomId={}, categoryId={}, participantId={}",
                message.getRoomId(), message.getCategoryId(), message.getParticipantId());

        try {
            // Rate limiting check
            if (isRateLimitExceeded(message.getParticipantId())) {
                log.warn("Rate limit exceeded for participant: {}", message.getParticipantId());
                // For MVP, just log and return - Story 2.5 will add proper error responses
                return;
            }
            // Create card via service (persists in room)
            Card card = cardService.createCard(
                    message.getRoomId(),
                    message.getContent(),
                    message.getCategoryId(),
                    message.getParticipantId(),
                    message.getParticipantId() // Using participantId as participantName for now
            );

            // Create broadcast message with real card data
            CardBroadcastMessage broadcast = new CardBroadcastMessage();
            broadcast.setAction("created");
            broadcast.setCardId(card.getId());
            broadcast.setCategoryId(card.getCategoryId());
            broadcast.setContent(card.getContent());
            broadcast.setParticipantId(card.getAuthorId());
            broadcast.setParticipantName(card.getAuthorName());
            broadcast.setTimestamp(card.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

            // Broadcast to all subscribers of the room
            messagingTemplate.convertAndSend("/topic/room." + message.getRoomId(), broadcast);

            log.info("Broadcasted card created: cardId={}", broadcast.getCardId());
        } catch (Exception e) {
            log.error("Failed to create card: roomId={}, error={}", message.getRoomId(), e.getMessage(), e);
            // For MVP, just log the error - Story 2.5 will add proper error handling
        }
    }

    @MessageMapping("/card.update")
    public void updateCard(@Valid @Payload CardUpdateMessage message) {
        log.info("Received card update message: roomId={}, cardId={}, participantId={}",
                message.getRoomId(), message.getCardId(), message.getParticipantId());

        try {
            // Update card via service (persists in room)
            Card card = cardService.updateCard(
                    message.getRoomId(),
                    message.getCardId(),
                    message.getContent(),
                    message.getParticipantId()
            );

            // Create broadcast message with updated card data
            CardBroadcastMessage broadcast = new CardBroadcastMessage();
            broadcast.setAction("updated");
            broadcast.setCardId(card.getId());
            broadcast.setCategoryId(card.getCategoryId());
            broadcast.setContent(card.getContent());
            broadcast.setParticipantId(message.getParticipantId());
            broadcast.setParticipantName(card.getAuthorName());
            broadcast.setTimestamp(card.getUpdatedAt() != null
                    ? card.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                    : card.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

            // Broadcast to all subscribers of the room
            messagingTemplate.convertAndSend("/topic/room." + message.getRoomId(), broadcast);

            log.info("Broadcasted card updated: cardId={}", broadcast.getCardId());
        } catch (Exception e) {
            log.error("Failed to update card: roomId={}, cardId={}, error={}",
                    message.getRoomId(), message.getCardId(), e.getMessage(), e);
            // For MVP, just log the error - Story 2.5 will add proper error handling
        }
    }

    @MessageMapping("/card.delete")
    public void deleteCard(@Valid @Payload CardDeleteMessage message) {
        log.info("Received card delete message: roomId={}, cardId={}, participantId={}",
                message.getRoomId(), message.getCardId(), message.getParticipantId());

        // Create broadcast message
        CardBroadcastMessage broadcast = new CardBroadcastMessage();
        broadcast.setAction("deleted");
        broadcast.setCardId(message.getCardId());
        broadcast.setCategoryId(null); // Not needed for delete
        broadcast.setContent(null); // Not needed for delete
        broadcast.setParticipantId(message.getParticipantId());
        broadcast.setParticipantName(null); // Will be set by frontend
        broadcast.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        // Broadcast to all subscribers of the room
        messagingTemplate.convertAndSend("/topic/room." + message.getRoomId(), broadcast);

        log.info("Broadcasted card deleted: cardId={}", broadcast.getCardId());
    }

    /**
     * Check if participant has exceeded rate limit (>10 cards in last second)
     */
    private boolean isRateLimitExceeded(String participantId) {
        long now = System.currentTimeMillis();

        // Get or create queue for this participant
        rateLimitMap.putIfAbsent(participantId, new java.util.concurrent.ConcurrentLinkedQueue<>());
        java.util.concurrent.ConcurrentLinkedQueue<Long> timestamps = rateLimitMap.get(participantId);

        // Remove timestamps older than 1 second
        timestamps.removeIf(timestamp -> now - timestamp > ONE_SECOND_MS);

        // Check if limit exceeded
        if (timestamps.size() >= MAX_CARDS_PER_SECOND) {
            return true;
        }

        // Add current timestamp
        timestamps.add(now);
        return false;
    }
}
