package com.library.service;

import com.library.model.Member;
import com.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MemberService {
    
    @Autowired
    private MemberRepository memberRepository;
    
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }
    
    public Optional<Member> getMemberById(String id) {
        return memberRepository.findById(id);
    }
    
    public Optional<Member> getMemberByUsername(String username) {
        return memberRepository.findByUsername(username);
    }
    
    public Member createMember(Member member) {
        if (memberRepository.existsByUsername(member.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        return memberRepository.save(member);
    }
    
    public Member updateMember(String id, Member member) {
        Member existingMember = memberRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Member not found"));
        
        if (!existingMember.getUsername().equals(member.getUsername()) &&
            memberRepository.existsByUsername(member.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        existingMember.setUsername(member.getUsername());
        existingMember.setName(member.getName());
        existingMember.setEmail(member.getEmail());
        if (member.getPassword() != null && !member.getPassword().isEmpty()) {
            existingMember.setPassword(member.getPassword());
        }
        
        return memberRepository.save(existingMember);
    }
    
    public void deleteMember(String id) {
        memberRepository.deleteById(id);
    }
    
    public boolean authenticate(String username, String password) {
        Optional<Member> member = memberRepository.findByUsername(username);
        return member.isPresent() && member.get().getPassword().equals(password);
    }
}


