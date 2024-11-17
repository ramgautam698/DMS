package com.example.demo.service;

import com.example.demo.model.Category;

public interface CategoryService
{
	public Category getByID(Integer ID);
	public void save(Category category);
	public void delete(Integer ID);
}
