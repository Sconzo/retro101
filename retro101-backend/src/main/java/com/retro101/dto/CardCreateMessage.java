package com.retro101.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardCreateMessage {
    @NotBlank(message = "Room ID is required")
    private String roomId;

    @NotBlank(message = "Category ID is required")
    private String categoryId;

    @NotBlank(message = "Content is required")
    @Size(min = 1, max = 500, message = "Content must be between 1 and 500 characters")
    private String content;

    @NotBlank(message = "Participant ID is required")
    private String participantId;
}
