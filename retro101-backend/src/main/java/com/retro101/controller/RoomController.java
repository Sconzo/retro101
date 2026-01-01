package com.retro101.controller;

import com.retro101.dto.AddParticipantRequest;
import com.retro101.dto.CreateRoomRequest;
import com.retro101.dto.CreateRoomResponse;
import com.retro101.model.Participant;
import com.retro101.model.Room;
import com.retro101.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public ResponseEntity<CreateRoomResponse> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        CreateRoomResponse response = roomService.createRoom(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<Room> getRoomById(@PathVariable String roomId) {
        Room room = roomService.getRoomById(roomId);
        return ResponseEntity.ok(room);
    }

    @GetMapping("/{roomId}/participants")
    public ResponseEntity<List<Participant>> getParticipants(@PathVariable String roomId) {
        List<Participant> participants = roomService.getParticipants(roomId);
        return ResponseEntity.ok(participants);
    }

    @PostMapping("/{roomId}/participants")
    public ResponseEntity<Participant> addParticipant(
            @PathVariable String roomId,
            @Valid @RequestBody AddParticipantRequest request
    ) {
        Participant participant = roomService.addParticipant(roomId, request.getName());

        // Broadcast participant joined via WebSocket
        Map<String, Object> message = new HashMap<>();
        message.put("action", "participant_joined");
        message.put("type", "PARTICIPANT_JOINED");
        message.put("participant", participant);
        message.put("timestamp", System.currentTimeMillis());

        messagingTemplate.convertAndSend("/topic/room." + roomId, message);

        return ResponseEntity.ok(participant);
    }
}
