package com.library.service;

import com.library.model.Borrowing;
import com.library.model.Book;
import com.library.model.Member;
import com.library.repository.BorrowingRepository;
import com.library.repository.BookRepository;
import com.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BorrowingService {
    
    @Autowired
    private BorrowingRepository borrowingRepository;
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private MemberRepository memberRepository;
    
    public List<Borrowing> getAllBorrowings() {
        return borrowingRepository.findAll();
    }
    
    public List<Borrowing> getBorrowingsByMember(String memberId) {
        return borrowingRepository.findByMemberId(memberId);
    }
    
    public List<Borrowing> getActiveBorrowingsByMember(String memberId) {
        return borrowingRepository.findByMemberIdAndReturnedFalse(memberId);
    }
    
    @Transactional
    public Borrowing borrowBook(String memberId, String bookId) {
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("Member not found"));
        
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found"));
        
        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Book not available");
        }
        
        Borrowing borrowing = new Borrowing(memberId, member.getUsername(), bookId, book.getTitle());
        borrowing = borrowingRepository.save(borrowing);
        
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);
        
        member.setCurrentBooksBorrowed(member.getCurrentBooksBorrowed() + 1);
        member.setTotalBooksBorrowed(member.getTotalBooksBorrowed() + 1);
        memberRepository.save(member);
        
        return borrowing;
    }
    
    @Transactional
    public Borrowing returnBook(String borrowingId) {
        Borrowing borrowing = borrowingRepository.findById(borrowingId)
            .orElseThrow(() -> new RuntimeException("Borrowing not found"));
        
        if (borrowing.isReturned()) {
            throw new RuntimeException("Book already returned");
        }
        
        borrowing.setReturned(true);
        borrowing.setReturnDate(LocalDateTime.now());
        borrowingRepository.save(borrowing);
        
        Book book = bookRepository.findById(borrowing.getBookId())
            .orElseThrow(() -> new RuntimeException("Book not found"));
        
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);
        
        Member member = memberRepository.findById(borrowing.getMemberId())
            .orElseThrow(() -> new RuntimeException("Member not found"));
        
        member.setCurrentBooksBorrowed(member.getCurrentBooksBorrowed() - 1);
        memberRepository.save(member);
        
        return borrowing;
    }
}


