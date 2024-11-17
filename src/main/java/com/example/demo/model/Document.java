package com.example.demo.model;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table
public class Document
{
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "doc_generator")
	@SequenceGenerator(name="doc_generator", sequenceName = "doc_seq", allocationSize=1)
	private int ID;
	
	@Column(nullable=false, length=50)
	private String Title;
	
	@Column(nullable=false, length=100)
	private String Location;
	
	@ManyToOne
	@JoinColumn(name = "UserID")
	private User user;
	
	@Column(nullable=true)
	private Date date;
	
	@Column(nullable=true, length=200)
	private String description;

	public Document(Integer id, String title, String location)
	{
		this.ID = id;
		this.Title = title;
		this.Location = location;
	}
	
	public Document()
	{}
	
	public Document(String title, String location)
	{
		this.Title = title;
		this.Location = location;
	}
	
	public Document(Integer id, String name)
	{
		this.ID = id;
		this.Title = name;
	}

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getTitle() {
		return Title;
	}

	public void setTitle(String title) {
		Title = title;
	}

	public String getLocation() {
		return Location;
	}

	public void setLocation(String location) {
		Location = location;
	}
	
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	@Override
    public String toString() {
        return "Document [ID = " + ID + ",Title = " + Title + ", Location =" + Location + 
        		", Date =" + date + ", Description =" + description + "]";
    }
}
