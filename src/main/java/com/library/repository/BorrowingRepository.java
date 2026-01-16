package com.library.repository;

import com.library.model.Borrowing;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BorrowingRepository extends MongoRepository<Borrowing, String> {
    List<Borrowing> findByMemberId(String memberId);
    List<Borrowing> findByMemberIdAndReturnedFalse(String memberId);
    List<Borrowing> findByBookId(String bookId);
    List<Borrowing> findByReturnedFalse();
}


