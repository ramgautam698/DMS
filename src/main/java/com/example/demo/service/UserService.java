package com.example.demo.service;

import com.example.demo.model.User;

public interface UserService
{
	public User login(User user);
	public User getByID(Integer userID);
	public void register(User user);
	public void update(User user);
}
