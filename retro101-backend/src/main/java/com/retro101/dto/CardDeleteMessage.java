package com.retro101.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardDeleteMessage {
    @NotBlank(message = "Room ID is required")
    private String roomId;

    @NotBlank(message = "Card ID is required")
    private String cardId;

    @NotBlank(message = "Participant ID is required")
    private String participantId;
}
