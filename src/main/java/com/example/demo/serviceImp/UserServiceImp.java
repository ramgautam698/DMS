package com.example.demo.serviceImp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import com.example.demo.dao.UserDao;
import com.example.demo.model.User;
import com.example.demo.service.UserService;

@Service
public class UserServiceImp implements UserService
{
	@Autowired
	private UserDao userdao;

	@Override
	public User login(User user)
	{
		user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
		//User loginuser = userdao.findByUserID(user.getUserID());
		User loginuser = userdao.findByEmail(user.getEmail());
		if (loginuser==null )
			throw new RuntimeException("User not found .");
		else
		{
			if(loginuser.isApproved() && loginuser.isActive())
			{
				if(user.getPassword().equalsIgnoreCase(loginuser.getPassword()))
				{
					return loginuser;
				}
				else
				{
					throw new RuntimeException("!!! Password Dosen't Match !!!");
				}
			}
			else
				throw new RuntimeException("!!! ERROR. Try Again or Contact Admin !!!");
		}
	}

	@Override
	public User getByID(Integer userID)
	{
		return userdao.getById(userID);
	}

	@Override
	public void register(User user)
	{
		user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
		userdao.save(user);
	}
	
	public User admin(User user) // makes admin log in
	{
		user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
		User loginuser = userdao.findByEmail(user.getEmail());
		if(loginuser.isAdmin() && loginuser.isActive())
			return loginuser;
		else
			throw new RuntimeException("!!! ERROR OCCURED !!!");
	}
	
	public void Approve(Integer userID) // approves user with userID to log in
	{
		User u = userdao.findByUserID(userID);
		u.setApproved(true);
		userdao.save(u);
	}
	
	public boolean checkUser(Integer id) // checks if user exists
	{
		User U = userdao.findByUserID(id);
		if(U==null)
			return false;
		return true;
	}
	
	public void deleteUser(User u) // makes user unable to log in
	{
		userdao.save(u);
	}
	
	public boolean EMail(String email) // checks if the email can be used
	{
		if(userdao.findByEmail(email)==null)
			return true;
		else
			return false;
	}
	
	public void update(User user) // update user data in database
	{
		User U = userdao.findByUserID(user.getUserID());
		if(U==null)
			throw new RuntimeException("ERROR OCCURED!!!");
		if(user.getName() != null)
			U.setName(user.getName());
		if(user.getEmail() != null)
			U.setEmail(user.getEmail());
		if(user.getPassword() != null)
			U.setPassword(user.getPassword());
		userdao.save(U);
	}
	
	public List<User> users() // return list of all users
	{
		return userdao.findAll();
	}
	
	public Integer ID_of_EMAIL(String user_Email) // return id of user with given email
	{
		User u = userdao.findByEmail(user_Email);
		if(u==null)
			return -1;
		return u.getUserID();
	}
}
