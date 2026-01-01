package com.retro101.controller;

import com.retro101.dto.CreateRoomRequest;
import com.retro101.dto.CreateRoomResponse;
import com.retro101.model.Room;
import com.retro101.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

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
}
