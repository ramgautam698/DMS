package com.example.demo.service;

import com.example.demo.model.Document_Category;

public interface Document_CategoryService
{
	public Document_Category findByID(Integer id);
	public void save(Document_Category obj);
	public void delete(Integer id);
}
