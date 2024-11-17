package com.example.demo.model;

import javax.persistence.Table;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;

@Entity
@Table(name="document_category")
public class Document_Category
{
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dc_generator")
	@SequenceGenerator(name="dc_generator", sequenceName = "dc_seq", allocationSize=1)
	private int ID;
	
	@ManyToOne
	@JoinColumn(name="doc_ID")
	private Document doc;
	
	@ManyToOne
	@JoinColumn(name="category_ID")
	private Category category;
	
	//@Column(nullable=true, length=20)
	//private String remarks;
	
	public Document_Category()
	{}
	
	public Document_Category(Document d, Category c)
	{
		this.category = c;
		this.doc = d;
	}

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public Document getDoc() {
		return doc;
	}

	public void setDoc(Document doc) {
		this.doc = doc;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}
}
