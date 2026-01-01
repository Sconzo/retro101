package com.retro101.repository;

import com.retro101.model.Room;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory storage for rooms using ConcurrentHashMap for thread-safety.
 * This is a simple MVP implementation - will be replaced with database in future.
 */
@Repository
public class RoomRepository {
    private final ConcurrentHashMap<String, Room> rooms = new ConcurrentHashMap<>();

    public Room save(Room room) {
        rooms.put(room.getId(), room);
        return room;
    }

    public Optional<Room> findById(String id) {
        return Optional.ofNullable(rooms.get(id));
    }

    public boolean existsById(String id) {
        return rooms.containsKey(id);
    }
}
