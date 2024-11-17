package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Document;

@Repository
public interface DocumentDao extends JpaRepository<Document, Integer>{
	public Document findByID(Integer DocumentID);
}
