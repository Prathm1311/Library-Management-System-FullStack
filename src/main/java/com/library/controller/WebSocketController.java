package com.library.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Controller
public class WebSocketController {
    
    @MessageMapping("/refresh")
    @SendTo("/topic/updates")
    public Map<String, String> refresh() {
        return Map.of("message", "refresh", "timestamp", String.valueOf(System.currentTimeMillis()));
    }
}


