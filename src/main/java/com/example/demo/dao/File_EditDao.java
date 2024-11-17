package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.File_Edit;

@Repository
public interface File_EditDao extends JpaRepository<File_Edit, Integer>
{
	public File_Edit findByID(Integer File_EditID);
	
	@Query(value="SELECT * FROM file_edit f WHERE (f.user_id = :userID and (f.action = 's' or f.action = 'x'))",
			nativeQuery = true)
	List<File_Edit> allShareLogOFUser(@Param("userID") Integer userID);
	
	@Query(value="SELECT * FROM file_edit f WHERE (f.doc_id = :doc and (f.action = 's' or f.action = 'x'))",
			nativeQuery = true)
	List<File_Edit> log_doc(@Param("doc") Integer doc);
}
