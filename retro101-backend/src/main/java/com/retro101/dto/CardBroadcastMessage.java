package com.retro101.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardBroadcastMessage {
    private String action; // "created", "updated", "deleted"
    private String cardId;
    private String categoryId;
    private String content;
    private String participantId;
    private String participantName;
    private String timestamp;
}
