package com.retro101.controller;

import com.retro101.model.Card;
import com.retro101.service.CardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class CardController {
    private final CardService cardService;

    /**
     * Get all cards for a room (for state reconciliation after reconnect)
     *
     * @param roomId The room ID
     * @return List of all cards in the room
     */
    @GetMapping("/{roomId}/cards")
    public ResponseEntity<List<Card>> getCards(@PathVariable String roomId) {
        log.info("REST GET request for cards in room={}", roomId);
        List<Card> cards = cardService.getCards(roomId);
        return ResponseEntity.ok(cards);
    }
}
