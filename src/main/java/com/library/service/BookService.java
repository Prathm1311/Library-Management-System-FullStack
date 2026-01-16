package com.library.service;

import com.library.model.Book;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {
    
    @Autowired
    private BookRepository bookRepository;
    
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
    
    public Optional<Book> getBookById(String id) {
        return bookRepository.findById(id);
    }
    
    public List<Book> searchBooks(String query) {
        List<Book> byTitle = bookRepository.findByTitleContainingIgnoreCase(query);
        List<Book> byAuthor = bookRepository.findByAuthorContainingIgnoreCase(query);
        byTitle.addAll(byAuthor.stream().filter(b -> !byTitle.contains(b)).toList());
        return byTitle;
    }
    
    public Book createBook(Book book) {
        return bookRepository.save(book);
    }
    
    public Book updateBook(String id, Book book) {
        Book existingBook = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found"));
        
        existingBook.setTitle(book.getTitle());
        existingBook.setAuthor(book.getAuthor());
        existingBook.setIsbn(book.getIsbn());
        existingBook.setCategory(book.getCategory());
        existingBook.setTotalCopies(book.getTotalCopies());
        existingBook.setAvailableCopies(book.getAvailableCopies());
        
        return bookRepository.save(existingBook);
    }
    
    public void deleteBook(String id) {
        bookRepository.deleteById(id);
    }
}


