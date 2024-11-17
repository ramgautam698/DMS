package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.User;

@Repository
public interface UserDao extends JpaRepository<User, Integer>{
	public User findByUserID(Integer userID);
	public User findByEmail(String email);
}
