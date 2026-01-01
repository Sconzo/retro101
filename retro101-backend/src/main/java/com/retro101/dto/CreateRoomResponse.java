package com.retro101.dto;

import com.retro101.model.Room;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateRoomResponse {
    private String roomId;
    private String shareLink;
    private Room room;
}
