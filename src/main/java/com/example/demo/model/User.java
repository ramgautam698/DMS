package com.example.demo.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table
public class User
{
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_generator")
	@SequenceGenerator(name="user_generator", sequenceName = "user_seq", allocationSize=1)
	private Integer userID;
	
	@Column(length=20)
	private String name;
	
	@Column(nullable=false, length=50)
	private String email;
	
	@Column(nullable=false, length=255)
	private String password;
	
	@OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Document> documentList;
	
	@Column(nullable=false)
	private LocalDate date_of_joined;
	
	@Column(nullable=false)
	private LocalTime time_of_joined;
	
	@Column(columnDefinition = "boolean default false")
	private boolean approved;
	
	@Column(columnDefinition = "boolean default true")
	private boolean active;
	
	@Column(nullable=true)
	private LocalDate Date_Left;
	
	@Column(nullable=false,columnDefinition = "boolean default false")
	private boolean admin;
	
	public Integer getUserID() {
		return userID;
	}

	public void setUserID(Integer userID) {
		this.userID = userID;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public List<Document> getDocumentList() {
		return documentList;
	}

	public void setDocumentList(List<Document> documentList) {
		this.documentList = documentList;
	}
	
	public void add(Document document)
	{
		if (documentList==null)
			documentList = new ArrayList<Document>();
		documentList.add(document);
		document.setUser(this);
	}

	public LocalDate getDate_of_joined() {
		return date_of_joined;
	}

	public void setDate_of_joined(LocalDate date_of_joined) {
		this.date_of_joined = date_of_joined;
	}

	public LocalTime getTime_of_joined() {
		return time_of_joined;
	}

	public void setTime_of_joined(LocalTime time_of_joined) {
		this.time_of_joined = time_of_joined;
	}

	public boolean isApproved() {
		return approved;
	}

	public void setApproved(boolean approved) {
		this.approved = approved;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public LocalDate getDate_Left() {
		return Date_Left;
	}

	public void setDate_Left(LocalDate date_Left) {
		Date_Left = date_Left;
	}

	public boolean isAdmin() {
		return admin;
	}

	public void setAdmin(boolean admin) {
		this.admin = admin;
	}
	
}
