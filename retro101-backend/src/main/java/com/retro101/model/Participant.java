package com.retro101.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Participant {
    private String id;
    private String name;
    private String roomId;
    private LocalDateTime joinedAt;

    public Participant(String name, String roomId) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.roomId = roomId;
        this.joinedAt = LocalDateTime.now();
    }
}
