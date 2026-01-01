package com.retro101.controller;

import com.retro101.dto.CardBroadcastMessage;
import com.retro101.dto.CardCreateMessage;
import com.retro101.dto.CardDeleteMessage;
import com.retro101.dto.CardUpdateMessage;
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

    @MessageMapping("/card.create")
    public void createCard(@Valid @Payload CardCreateMessage message) {
        log.info("Received card create message: roomId={}, categoryId={}, participantId={}",
                message.getRoomId(), message.getCategoryId(), message.getParticipantId());

        // Create broadcast message
        CardBroadcastMessage broadcast = new CardBroadcastMessage();
        broadcast.setAction("created");
        broadcast.setCardId(java.util.UUID.randomUUID().toString());
        broadcast.setCategoryId(message.getCategoryId());
        broadcast.setContent(message.getContent());
        broadcast.setParticipantId(message.getParticipantId());
        broadcast.setParticipantName(null); // Will be set by frontend
        broadcast.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        // Broadcast to all subscribers of the room
        messagingTemplate.convertAndSend("/topic/room." + message.getRoomId(), broadcast);

        log.info("Broadcasted card created: cardId={}", broadcast.getCardId());
    }

    @MessageMapping("/card.update")
    public void updateCard(@Valid @Payload CardUpdateMessage message) {
        log.info("Received card update message: roomId={}, cardId={}, participantId={}",
                message.getRoomId(), message.getCardId(), message.getParticipantId());

        // Create broadcast message
        CardBroadcastMessage broadcast = new CardBroadcastMessage();
        broadcast.setAction("updated");
        broadcast.setCardId(message.getCardId());
        broadcast.setCategoryId(null); // Not changed in update
        broadcast.setContent(message.getContent());
        broadcast.setParticipantId(message.getParticipantId());
        broadcast.setParticipantName(null); // Will be set by frontend
        broadcast.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        // Broadcast to all subscribers of the room
        messagingTemplate.convertAndSend("/topic/room." + message.getRoomId(), broadcast);

        log.info("Broadcasted card updated: cardId={}", broadcast.getCardId());
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
}
