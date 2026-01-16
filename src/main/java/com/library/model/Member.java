package com.library.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;

@Document(collection = "members")
public class Member {
    @Id
    private String id;
    
    @NotBlank
    private String username;
    
    @NotBlank
    private String password;
    
    private String name;
    private String email;
    private int totalBooksBorrowed;
    private int currentBooksBorrowed;
    
    public Member() {}
    
    public Member(String username, String password, String name, String email) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.totalBooksBorrowed = 0;
        this.currentBooksBorrowed = 0;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public int getTotalBooksBorrowed() {
        return totalBooksBorrowed;
    }
    
    public void setTotalBooksBorrowed(int totalBooksBorrowed) {
        this.totalBooksBorrowed = totalBooksBorrowed;
    }
    
    public int getCurrentBooksBorrowed() {
        return currentBooksBorrowed;
    }
    
    public void setCurrentBooksBorrowed(int currentBooksBorrowed) {
        this.currentBooksBorrowed = currentBooksBorrowed;
    }
}


