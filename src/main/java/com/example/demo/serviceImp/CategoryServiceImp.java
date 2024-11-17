package com.example.demo.serviceImp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.CategoryDao;
import com.example.demo.model.Category;

@Service
public class CategoryServiceImp implements com.example.demo.service.CategoryService
{
	@Autowired
	private CategoryDao cat;
	
	@Override
	public Category getByID(Integer ID)
	{
		return cat.findByID(ID);
	}

	@Override
	public void save(Category category)
	{
		cat.save(category);
	}

	@Override
	public void delete(Integer ID)
	{
		Category c = cat.findByID(ID);
		if(c==null)
			return;
		cat.delete(c);
	}
	
	public List<Category> getAllactive() // get all active categories
	{
		return cat.findByActive();
	}
	
	public List<Category> getAllBy_user(String userID) // get all categories of user with userID, also active
	{
		List<Category> c1 = cat.findByActive();
		List<Category> c2 = cat.findByUSERID(Integer.parseInt(userID), 0);
		c1.addAll(c2);
		return c1;
	}
}
