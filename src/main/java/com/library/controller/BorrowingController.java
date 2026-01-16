package com.library.controller;

import com.library.model.Borrowing;
import com.library.service.BorrowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrowings")
@CrossOrigin(origins = "*")
public class BorrowingController {
    
    @Autowired
    private BorrowingService borrowingService;
    
    @GetMapping
    public ResponseEntity<List<Borrowing>> getAllBorrowings() {
        return ResponseEntity.ok(borrowingService.getAllBorrowings());
    }
    
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Borrowing>> getBorrowingsByMember(@PathVariable String memberId) {
        return ResponseEntity.ok(borrowingService.getBorrowingsByMember(memberId));
    }
    
    @GetMapping("/member/{memberId}/active")
    public ResponseEntity<List<Borrowing>> getActiveBorrowingsByMember(@PathVariable String memberId) {
        return ResponseEntity.ok(borrowingService.getActiveBorrowingsByMember(memberId));
    }
    
    @PostMapping("/borrow")
    public ResponseEntity<?> borrowBook(@RequestBody Map<String, String> request) {
        try {
            String memberId = request.get("memberId");
            String bookId = request.get("bookId");
            Borrowing borrowing = borrowingService.borrowBook(memberId, bookId);
            return ResponseEntity.ok(borrowing);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/return/{id}")
    public ResponseEntity<?> returnBook(@PathVariable String id) {
        try {
            Borrowing borrowing = borrowingService.returnBook(id);
            return ResponseEntity.ok(borrowing);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}


