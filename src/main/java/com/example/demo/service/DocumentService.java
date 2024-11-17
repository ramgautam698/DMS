package com.example.demo.service;

import com.example.demo.model.Document;

public interface DocumentService
{
	public Document getByID(Integer DocumentID);
	public void save(Document document);
	public void delete(Integer documentID);
}
