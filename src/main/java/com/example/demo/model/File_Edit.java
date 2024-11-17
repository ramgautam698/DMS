package com.example.demo.model;

import java.time.LocalDate;
import java.time.LocalTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class File_Edit
{
	@Id
	@GeneratedValue
	private int ID;
	
	@Column(nullable=false)
	private LocalDate date;
	
	@Column
	private LocalTime time;
	
	@Column(nullable=false)
	private Integer user_ID;
	
	@Column(nullable=true)
	private Integer doc_ID; // ID of document in table Document, null if deleted
	
	@Column(nullable=false, length=1)
	private String action;
	// "e" for edited, "u" for uploaded, "d" for deleted, "n" for change of file name, "s" for shared, "x" for unshared
	
	@Column(nullable=true,length=100)
	private String Edited_file;
	// previous file name before editing, file path if deleted, old name if file name changed, id of other user if shared
	
	public File_Edit()
	{}
	
	public File_Edit(LocalDate d, LocalTime t, Integer UID, Integer doc_id, String action) // for file upload
	{
		this.date = d;
		this.time = t;
		this.user_ID = UID;
		this.doc_ID = doc_id;
		this.action = action;
	}
	
	public File_Edit(LocalDate d, LocalTime t, String path, Integer user_id) // for file delete
	{
		this.date = d;
		this.time = t;
		this.Edited_file = path;
		this.action = "d";
		this.user_ID = user_id;
	}
	
	public File_Edit(LocalDate d, LocalTime t, Integer user_id, Integer doc_id, String oldfile, String action) 
	// for file edit and sharing
	{
		this.date = d;
		this.time = t;
		this.Edited_file = oldfile;
		this.doc_ID = doc_id;
		this.action = action;
		this.user_ID = user_id;
	}
	
	public File_Edit(LocalDate d, LocalTime t, Integer doc_id, String oldName, Integer user_id) // for file name change
	{
		this.date = d;
		this.time = t;
		this.doc_ID = doc_id;
		this.Edited_file = oldName;
		this.action = "n";
		this.user_ID = user_id;
	}

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public LocalTime getTime() {
		return time;
	}

	public void setTime(LocalTime time) {
		this.time = time;
	}

	public Integer getUser_ID() {
		return user_ID;
	}

	public void setUser_ID(Integer user_ID) {
		this.user_ID = user_ID;
	}

	public Integer getDoc_ID() {
		return doc_ID;
	}

	public void setDoc_ID(Integer doc_ID) {
		this.doc_ID = doc_ID;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getEdited_file() {
		return Edited_file;
	}

	public void setEdited_file(String edited_file) {
		Edited_file = edited_file;
	}
}
