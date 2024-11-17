package com.example.demo.model;

import java.time.LocalDate;
import java.time.LocalTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table
public class Category
{
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cat_generator")
	@SequenceGenerator(name="cat_generator", sequenceName = "cat_seq", allocationSize=1)
	private int ID;
	
	@Column(nullable=false, length=20)
	private String name;
	
	@Column(nullable=false, length=100)
	private String description;
	
	@Column(columnDefinition = "boolean default true")
	private boolean active;
	
	@Column(nullable=true, length=20)
	private String created_by;
	
	@Column(nullable=false)
	private LocalDate date;
	
	@Column(nullable=false)
	private LocalTime time;
	
	public Category()
	{
		this.name = "NO NAME";
		this.description = "NO DESCRIPTION";
		this.date = java.time.LocalDate.now();
		this.time = java.time.LocalTime.now();
	}
	
	public Category(String name, String des,String creator)
	{
		this.name = name;
		this.description = des;
		this.created_by = creator;
		this.date = java.time.LocalDate.now();
		this.time = java.time.LocalTime.now();
	}
	
	public Category(Integer id, String name, boolean active, String des)
	{
		this.ID = id;
		this.name = name;
		this.active = active;
		this.description = des;
		this.date = java.time.LocalDate.now();
		this.time = java.time.LocalTime.now();
	}

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getCreated_by() {
		return created_by;
	}

	public void setCreated_by(String created_by) {
		this.created_by = created_by;
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
}

