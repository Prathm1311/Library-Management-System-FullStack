package com.library.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "borrowings")
public class Borrowing {
    @Id
    private String id;
    
    private String memberId;
    private String memberUsername;
    private String bookId;
    private String bookTitle;
    private LocalDateTime borrowDate;
    private LocalDateTime returnDate;
    private boolean returned;
    
    public Borrowing() {
        this.borrowDate = LocalDateTime.now();
        this.returned = false;
    }
    
    public Borrowing(String memberId, String memberUsername, String bookId, String bookTitle) {
        this.memberId = memberId;
        this.memberUsername = memberUsername;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.borrowDate = LocalDateTime.now();
        this.returned = false;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getMemberId() {
        return memberId;
    }
    
    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }
    
    public String getMemberUsername() {
        return memberUsername;
    }
    
    public void setMemberUsername(String memberUsername) {
        this.memberUsername = memberUsername;
    }
    
    public String getBookId() {
        return bookId;
    }
    
    public void setBookId(String bookId) {
        this.bookId = bookId;
    }
    
    public String getBookTitle() {
        return bookTitle;
    }
    
    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }
    
    public LocalDateTime getBorrowDate() {
        return borrowDate;
    }
    
    public void setBorrowDate(LocalDateTime borrowDate) {
        this.borrowDate = borrowDate;
    }
    
    public LocalDateTime getReturnDate() {
        return returnDate;
    }
    
    public void setReturnDate(LocalDateTime returnDate) {
        this.returnDate = returnDate;
    }
    
    public boolean isReturned() {
        return returned;
    }
    
    public void setReturned(boolean returned) {
        this.returned = returned;
    }
}


