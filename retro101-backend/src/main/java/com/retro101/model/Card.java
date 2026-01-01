package com.retro101.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Card {
    private String id;

    @NotBlank(message = "Card content cannot be empty")
    @Size(max = 500, message = "Card content must not exceed 500 characters")
    private String content;

    @NotBlank(message = "Category ID is required")
    private String categoryId;

    @NotBlank(message = "Author ID is required")
    private String authorId;

    @NotBlank(message = "Author name is required")
    private String authorName;

    @NotBlank(message = "Room ID is required")
    private String roomId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String updatedBy;

    /**
     * Convenience constructor that generates ID and timestamp automatically
     */
    public Card(String content, String categoryId, String authorId, String authorName, String roomId) {
        this.id = UUID.randomUUID().toString();
        this.content = content;
        this.categoryId = categoryId;
        this.authorId = authorId;
        this.authorName = authorName;
        this.roomId = roomId;
        this.createdAt = LocalDateTime.now();
    }
}
