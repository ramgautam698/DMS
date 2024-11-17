package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Category;

@Repository
public interface CategoryDao extends JpaRepository<Category, Integer>
{
	public Category findByID(Integer ID);
	
	@Query( value = "SELECT * FROM category WHERE active = 1", nativeQuery = true)
	List<Category> findByActive();
	
	@Query( value = "SELECT * FROM category c WHERE (c.created_by = :userID and c.active = :active)",
			nativeQuery = true)
	List<Category> findByUSERID(@Param("userID") Integer userID, @Param("active") Integer active);
}
