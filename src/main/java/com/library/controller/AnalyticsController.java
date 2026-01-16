package com.library.controller;

import com.library.model.Member;
import com.library.service.MemberService;
import com.library.service.BorrowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
    
    @Autowired
    private MemberService memberService;
    
    @Autowired
    private BorrowingService borrowingService;
    
    @GetMapping("/member/{memberId}")
    public ResponseEntity<Map<String, Object>> getMemberAnalytics(@PathVariable String memberId) {
        Map<String, Object> analytics = new HashMap<>();
        
        Member member = memberService.getMemberById(memberId)
            .orElseThrow(() -> new RuntimeException("Member not found"));
        
        analytics.put("member", member);
        analytics.put("totalBorrowings", borrowingService.getBorrowingsByMember(memberId).size());
        analytics.put("activeBorrowings", borrowingService.getActiveBorrowingsByMember(memberId).size());
        analytics.put("totalBooksBorrowed", member.getTotalBooksBorrowed());
        analytics.put("currentBooksBorrowed", member.getCurrentBooksBorrowed());
        
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalMembers", memberService.getAllMembers().size());
        stats.put("totalBooks", borrowingService.getAllBorrowings().size());
        
        return ResponseEntity.ok(stats);
    }
}


