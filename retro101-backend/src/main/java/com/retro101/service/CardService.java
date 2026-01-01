package com.retro101.service;

import com.retro101.exception.RoomNotFoundException;
import com.retro101.model.Card;
import com.retro101.model.Room;
import com.retro101.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CardService {
    private final RoomRepository roomRepository;

    /**
     * Creates a new card in the specified room.
     *
     * @param roomId     The ID of the room
     * @param content    The card content
     * @param categoryId The category ID where the card belongs
     * @param authorId   The participant ID who created the card
     * @param authorName The participant name who created the card
     * @return The created card with generated ID and timestamp
     * @throws RoomNotFoundException      if room doesn't exist
     * @throws IllegalArgumentException   if validation fails
     */
    public Card createCard(String roomId, String content, String categoryId,
                           String authorId, String authorName) {
        log.info("Creating card in room={}, category={}, author={}", roomId, categoryId, authorId);

        // Validate room exists
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found: " + roomId));

        // Validate content
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Card content cannot be empty");
        }
        if (content.length() > 500) {
            throw new IllegalArgumentException("Card content must not exceed 500 characters");
        }

        // Validate category belongs to room
        boolean categoryExists = room.getCategories().stream()
                .anyMatch(cat -> cat.getId().equals(categoryId));
        if (!categoryExists) {
            throw new IllegalArgumentException("Category not found in room: " + categoryId);
        }

        // Create card
        Card card = new Card(content.trim(), categoryId, authorId, authorName, roomId);

        // Add to room
        room.addCard(card);

        // Save room (in-memory update)
        roomRepository.save(room);

        log.info("Card created successfully: cardId={}", card.getId());
        return card;
    }

    /**
     * Updates an existing card's content.
     *
     * @param roomId     The ID of the room
     * @param cardId     The ID of the card to update
     * @param content    The new card content
     * @param editorId   The participant ID who is editing the card
     * @return The updated card
     * @throws RoomNotFoundException      if room doesn't exist
     * @throws IllegalArgumentException   if card not found or validation fails
     */
    public Card updateCard(String roomId, String cardId, String content, String editorId) {
        log.info("Updating card={} in room={}, editor={}", cardId, roomId, editorId);

        // Validate room exists
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found: " + roomId));

        // Find the card
        Card card = room.getCards().stream()
                .filter(c -> c.getId().equals(cardId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Card not found: " + cardId));

        // Validate content
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Card content cannot be empty");
        }
        if (content.length() > 500) {
            throw new IllegalArgumentException("Card content must not exceed 500 characters");
        }

        // Update card
        card.setContent(content.trim());
        card.setUpdatedAt(java.time.LocalDateTime.now());
        card.setUpdatedBy(editorId);

        // Save room (in-memory update)
        roomRepository.save(room);

        log.info("Card updated successfully: cardId={}", card.getId());
        return card;
    }

    /**
     * Deletes an existing card from the room.
     *
     * @param roomId     The ID of the room
     * @param cardId     The ID of the card to delete
     * @throws RoomNotFoundException      if room doesn't exist
     * @throws IllegalArgumentException   if card not found
     */
    public void deleteCard(String roomId, String cardId) {
        log.info("Deleting card={} from room={}", cardId, roomId);

        // Validate room exists
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found: " + roomId));

        // Find and validate card exists
        boolean cardExists = room.getCards().stream()
                .anyMatch(c -> c.getId().equals(cardId));

        if (!cardExists) {
            throw new IllegalArgumentException("Card not found: " + cardId);
        }

        // Remove card from room
        room.getCards().removeIf(card -> card.getId().equals(cardId));

        // Save room (in-memory update)
        roomRepository.save(room);

        log.info("Card deleted successfully: cardId={}", cardId);
    }
}
