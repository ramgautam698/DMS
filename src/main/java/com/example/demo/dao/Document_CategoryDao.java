package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Category;
import com.example.demo.model.Document;
import com.example.demo.model.Document_Category;

@Repository
public interface Document_CategoryDao extends JpaRepository<Document_Category, Integer>
{
	public Document_Category findByID(Integer ID);
	public List<Document_Category> findByCategory(Category C);
	
	@Query(value="SELECT * FROM document_category dc WHERE dc.doc_ID = :doc_ID", nativeQuery = true)
	List<Document_Category> category_IDs(@Param("doc_ID") Integer doc_ID);
	
	@Query(value="SELECT * FROM document_category dc WHERE (dc.doc_ID = :doc_ID and dc.category_ID = :CID)",
			nativeQuery = true)
	List<Document_Category> document_category_MAP(@Param("doc_ID") Integer doc_ID, @Param("CID") Integer CID);
}
