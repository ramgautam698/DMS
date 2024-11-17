package com.example.demo;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.example.demo.model.File_Edit;
import com.example.demo.model.User;
import com.example.demo.serviceImp.File_EditSImp;
import com.example.demo.serviceImp.UserServiceImp;

//@Controller
@RestController
public class HomeController 
{
	@RequestMapping("")
	public String home()
	{
		return "index";
	}
	
	// Administration Controls
	
	@Autowired
	private UserServiceImp admin;
	
	@Autowired
	private File_EditSImp log;
	
	@RequestMapping("/admin")
	public String AdminPage()
	{
		return "adminLogIn";
	}
	
	@RequestMapping(value = "/ALD", method = RequestMethod.POST)
	public ModelAndView loginU(@ModelAttribute User user, ModelMap model, HttpSession session) // makes admin login
	{
		try
		{
			User u = admin.admin(user);
			session.setAttribute("ActiveUserID", u.getUserID());
			System.out.println("Reached here ad: " + u.isAdmin());
			return new ModelAndView("redirect:/dashboard", model);
		}
		catch(RuntimeException e)
        {
			return new ModelAndView("redirect:/admin",model);
        }
    }
	
	@RequestMapping(value="/approve",method = RequestMethod.POST)
	public void approve(@RequestBody String ID) // approves the user with ID for log in
	{
		admin.Approve(Integer.parseInt(ID));
	}
	
	@RequestMapping("/dashboard")
	public String userpage(HttpSession session, Model model) // displays the page where all information for user is shown
	{
		User u = admin.getByID((Integer) session.getAttribute("ActiveUserID"));
		model.addAttribute("name", u.getName());
		return "dashboard";
	}
	
	@RequestMapping(value="/listUser",method = RequestMethod.POST, produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody List<User> listOfUser(HttpSession session) // gets all data of user except password
	{
		if ((Integer) session.getAttribute("ActiveUserID")==null)
			return null;
		List<User> allUsers = admin.users();
		allUsers.stream().map(User->
		{
			User.setDocumentList(null);
			return User;
		}).collect(Collectors.toList());
		return allUsers;
		
	}
	
	@RequestMapping(value="/log",method = RequestMethod.POST, produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody List<File_Edit> getLog(HttpSession session) // gets all data of table File_Edit (i.e logs of action on file)
	{
		if ((Integer) session.getAttribute("ActiveUserID")==null)
			return null;
		return log.getALL();
	}
	
	@GetMapping("logoutAdmin")
	public String logout(HttpSession session) // logout admin
	{
		session.invalidate();
		return "index";
	}
}
