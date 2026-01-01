package com.retro101.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Room {
    private String id;
    private List<Category> categories;
    private List<Participant> participants;
    private List<Card> cards;
    private LocalDateTime createdAt;
    private boolean active;

    public void addParticipant(Participant participant) {
        if (this.participants == null) {
            this.participants = new ArrayList<>();
        }
        this.participants.add(participant);
    }

    public void addCard(Card card) {
        if (this.cards == null) {
            this.cards = new ArrayList<>();
        }
        this.cards.add(card);
    }

    public List<Card> getCards() {
        return this.cards != null ? this.cards : new ArrayList<>();
    }
}
