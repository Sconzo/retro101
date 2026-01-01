package com.retro101.service;

import com.retro101.dto.CreateRoomRequest;
import com.retro101.dto.CreateRoomResponse;
import com.retro101.model.Category;
import com.retro101.model.Participant;
import com.retro101.model.Room;
import com.retro101.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;

    @Value("${frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public CreateRoomResponse createRoom(CreateRoomRequest request) {
        // Generate unique room ID
        String roomId = UUID.randomUUID().toString();

        // Create categories
        List<Category> categories = request.getCategories().stream()
                .map(name -> new Category(UUID.randomUUID().toString(), name, roomId))
                .collect(Collectors.toList());

        // Create room
        Room room = new Room();
        room.setId(roomId);
        room.setCategories(categories);
        room.setParticipants(new ArrayList<>());
        room.setCreatedAt(LocalDateTime.now());
        room.setActive(true);

        // Save to repository
        roomRepository.save(room);

        // Build share link
        String shareLink = frontendUrl + "/room/" + roomId;

        return new CreateRoomResponse(roomId, shareLink, room);
    }

    public Room getRoomById(String roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new com.retro101.exception.RoomNotFoundException("Room not found: " + roomId));
    }

    public Participant addParticipant(String roomId, String name) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new com.retro101.exception.RoomNotFoundException("Room not found: " + roomId));

        Participant participant = new Participant(name, roomId);
        room.addParticipant(participant);

        // Update room in repository (in-memory update)
        roomRepository.save(room);

        return participant;
    }
}
