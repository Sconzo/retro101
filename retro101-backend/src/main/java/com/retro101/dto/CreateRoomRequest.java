package com.retro101.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreateRoomRequest {
    @NotNull(message = "Categories list cannot be null")
    @Size(min = 2, max = 5, message = "Must have between 2 and 5 categories")
    private List<@jakarta.validation.constraints.NotBlank(message = "Category name cannot be empty") String> categories;
}
