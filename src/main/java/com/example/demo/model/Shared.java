package com.example.demo.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table
public class Shared 
{
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "share_generator")
	@SequenceGenerator(name="share_generator", sequenceName = "share_seq", allocationSize=1)
	private int ID;
	
	@Column
	private Integer OwnerID;
	
	@Column
	private Integer Doc_ID;
	
	@Column
	private Integer Shared_with;
	
	public Shared(Integer ownerId, Integer Doc_ID, Integer ID_Of_user_to_whom_Is_share)
	{
		this.OwnerID = ownerId;
		this.Doc_ID = Doc_ID;
		this.Shared_with = ID_Of_user_to_whom_Is_share;
	}
	
	public Shared()
	{}

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public Integer getOwnerID() {
		return OwnerID;
	}

	public void setOwnerID(Integer ownerID) {
		OwnerID = ownerID;
	}

	public Integer getDoc_ID() {
		return Doc_ID;
	}

	public void setDoc_ID(Integer doc_ID) {
		Doc_ID = doc_ID;
	}

	public Integer getShared_with() {
		return Shared_with;
	}

	public void setShared_with(Integer shared_with) {
		Shared_with = shared_with;
	}
}
