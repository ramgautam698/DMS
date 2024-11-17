package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Shared;

@Repository
public interface SharedDao extends JpaRepository<Shared, Integer>
{
	public Shared findByID(Shared ID);
	
	@Query(value = "SELECT doc_id FROM shared s WHERE s.shared_with = :myID", nativeQuery = true)
	List<Integer> get_friends_docIDs(@Param("myID") Integer myID);
	
	@Query(value = "SELECT doc_id FROM shared s WHERE s.ownerid = :myID", nativeQuery = true)
	List<Integer> myShared_docIDs(@Param("myID") Integer myID);
	
	@Query(value = "SELECT shared_with FROM shared s WHERE s.doc_id = :d", nativeQuery = true)
	List<Integer> friends_IDs(@Param("d") Integer d);
	
	@Query(value = "SELECT id FROM shared s WHERE (s.doc_id = :d and s.ownerid = :owner and s.shared_with = :SW)",
			nativeQuery = true)
	Integer rowID(@Param("d") Integer d, @Param("owner") Integer owner, @Param("SW") Integer SW);
	
	@Query(value = "SELECT id FROM shared s WHERE (s.doc_id = :d and s.ownerid = :owner)", nativeQuery = true)
	List<Integer> rowID_OD(@Param("owner") Integer owner, @Param("d") Integer d);
	
	@Query(value = "SELECT shared_with FROM shared s WHERE s.ownerid = :myid", nativeQuery = true)
	List<Integer> who_shares_by_doc(@Param("myid") Integer myid);
	
	@Query(value = "SELECT shared_with FROM shared s WHERE s.shared_with = :myid", nativeQuery = true)
	List<Integer> who_shares_doc_with_me(@Param("myid") Integer myid);
	
}
