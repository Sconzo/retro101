package com.retro101.exception;

public class RoomNotFoundException extends RuntimeException {
    public RoomNotFoundException(String message) {
        super(message);
    }

    public RoomNotFoundException(String roomId, boolean includeRoomId) {
        super("Room not found: " + roomId);
    }
}
