package com.example.demo.service;

import com.example.demo.model.Shared;

public interface SharedService
{
	public Shared getByID(Integer ID);
	public void save(Shared s);
	public void delete(Shared s);
}
