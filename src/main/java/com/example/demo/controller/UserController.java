package com.example.demo.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.example.demo.model.Category;
import com.example.demo.model.Content;
import com.example.demo.model.Document;
import com.example.demo.model.Document_Category;
import com.example.demo.model.File_Edit;
import com.example.demo.model.Shared;
import com.example.demo.model.User;
import com.example.demo.serviceImp.CategoryServiceImp;
import com.example.demo.serviceImp.DocumentService;
import com.example.demo.serviceImp.Document_CategorySImp;
import com.example.demo.serviceImp.File_EditSImp;
import com.example.demo.serviceImp.SharedServiceImp;
import com.example.demo.serviceImp.UserServiceImp;

@Controller
public class UserController
{
	@Autowired
	private UserServiceImp userservice;
	
	@Autowired
	private DocumentService doc;
	
	@Autowired
	private SharedServiceImp share;
	
	@Autowired
	private File_EditSImp log;
	
	@Autowired
	private CategoryServiceImp cs;
	
	@Autowired
	private Document_CategorySImp dc;
	
	private boolean a = false; // attempt to make login
	
	@RequestMapping(value="/addCategory",method = RequestMethod.POST,
			headers = "Accept=*/*",produces = "application/json", consumes="application/json")
	public @ResponseBody boolean addCategory(@RequestBody Content input) // add category to document
	{
		try
		{
			Document d = doc.getByID(input.getId());
			Category c = cs.getByID(Integer.parseInt(input.getData()));
			Document_Category DC = new Document_Category(d,c);
			if(dc.check(DC))
				return false;
			dc.save(DC);
		}
		catch(Exception e)
		{
			return false;
		}
		return true;
	}
	
	@PostMapping(value="categoryCreate") // create new category
	public String categoryCreate(HttpServletRequest req, HttpSession session, Model m)
	{
		String name = req.getParameter("value");
		String desc = req.getParameter("desc");
		String active = req.getParameter("active"); // value = "on" if selected, else null
		Integer userID = (Integer) session.getAttribute("ActiveUserID");
		if(userID==null)
		{
			m.addAttribute("msg", "You must be logged in to create category");
			return "category";
		}
		Category c = new Category(name, desc, userID.toString());
		try
		{
			Integer temp = active.compareToIgnoreCase("on");
			if(temp==0)
				c.setActive(true);
		}
		catch(Exception e)
		{
			c.setActive(false);
		}
		cs.save(c);
		m.addAttribute("msg", "Category created.");
		return "category";
	}
	
	@GetMapping("categoryForm") // shows form to create new category
	public String createform()
	{
		return "category";
	}
	
	@RequestMapping(value="categoryEdit", method = RequestMethod.POST, produces = {MediaType.APPLICATION_XML_VALUE},
			headers = "Accept=*/*", consumes="application/json")
	public @ResponseBody ResponseEntity<String> categoryEdit(@RequestBody Category input, HttpSession session) // Edit the category
	{
		Category c = cs.getByID(input.getID());
		if(c==null)
			return new ResponseEntity<String>("ERROR!!!<br>Category with given id does not exist.", HttpStatus.OK);
		if(c.getCreated_by().compareToIgnoreCase(session.getAttribute("ActiveUserID").toString())!=0)
			return new ResponseEntity<String>("You cannot edit category that belongs to other!!!", HttpStatus.OK);
		c.setActive(input.isActive());
		String e = "";
		if(input.getDescription().compareToIgnoreCase(e)!=0)
			c.setDescription(input.getDescription());
		if(input.getName().compareToIgnoreCase(e)!=0)
			c.setName(input.getName());
		cs.save(c);
		return new ResponseEntity<String>("Updated.", HttpStatus.OK);
	}
	
	@RequestMapping(value="categoryView", method = RequestMethod.POST, produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody List<Category> categoryView(HttpSession session) // return all categories created by user
	{
		return cs.getAllBy_user(session.getAttribute("ActiveUserID").toString());
	}
	
	@RequestMapping(value="/changeTitle",method = RequestMethod.POST,headers = "Accept=*/*",produces = "application/json", consumes="application/json")
	public @ResponseBody boolean changeTitle(@RequestBody Content input, HttpSession session) //changes the title(filename) of document
	{	
		Integer id = Integer.parseInt(session.getAttribute("ActiveUserID").toString());
		Document dd = doc.getByID(input.getId());
		File file = new File(dd.getLocation() + dd.getTitle());
		File rename = new File(dd.getLocation() + input.getData());
		if(file.renameTo(rename))
		{
			File_Edit fe = new File_Edit(java.time.LocalDate.now(),java.time.LocalTime.now(), dd.getID() ,dd.getTitle(), id);
			log.save(fe);
			dd.setTitle(input.getData());
			doc.update(dd);
			return true;
		}
		return false;
	}
	
	@PostMapping(value = "/delete")
	public @ResponseBody boolean deletefile(@RequestBody String c, HttpSession session) // deletes the file
	{
		try
		{
			Integer id = Integer.parseInt(c);
			Document d = doc.getByID(id);
			
			File file = new File(d.getLocation() + d.getTitle());
			String path = d.getLocation() + "DEL_" +d.getTitle();
			File rename = new File(path);
			
			if(file.renameTo(rename))
			{
				Integer user_ID = Integer.parseInt(session.getAttribute("ActiveUserID").toString());
				List<Document_Category> allCategory = dc.ALL(d);
				for(int i=0;i<allCategory.size();i++)
				{
					dc.delete(allCategory.get(i).getID());
				}
				doc.delete(id);
				File_Edit f = new File_Edit(java.time.LocalDate.now(),java.time.LocalTime.now(), path, user_ID);
				log.save(f);
				Integer i = share.get_saved_id(user_ID, d.getID());
				share.deleteByID(i);
				return true;
			}
			return false;
		}
		catch(Exception e)
		{
			//System.out.println(e.getMessage());
			return false;
		}
	}
	
	@PostMapping("deleteUser")
	public String deleteUser(HttpServletRequest req, Model model,HttpSession session) // deletes user
	// user is actually not deleted but is made unable to log in
	{
		String current = DigestUtils.md5DigestAsHex(req.getParameter("CP").getBytes());
		
		User cu = userservice.getByID(Integer.parseInt(session.getAttribute("ActiveUserID").toString()));
		if(cu.getPassword().equalsIgnoreCase(current))
		{
			cu.setActive(false);
			cu.setDate_Left(java.time.LocalDate.now());
			userservice.deleteUser(cu);
			return "index";
		}
		else
			model.addAttribute("msg", "ERROR !!! \n Cannot be Deleted.");
		return "editUser";
	}
	
	@RequestMapping("download/{id}")
	public void download(HttpServletResponse response, @PathVariable("id") String id) // option to download file
	{
		try
		{
			Document document = doc.getByID(Integer.parseInt(id));
			String fileName = document.getTitle();
			Path file = Paths.get(document.getLocation(), document.getTitle());
			response.setContentType("APPLICATION/OCTET-STREAM");
			response.addHeader("Content-Disposition", "attachment; filename="+fileName);
			Files.copy(file, response.getOutputStream());
			response.getOutputStream().flush();
		}
		catch(Exception e)
		{}
	}
	
	@GetMapping("/editDetails")
	public String editDetails(Model m) // shows page for editing user details
	{
		return "editUser";
	}
	
	@PostMapping("editUser")
	public String editUser(HttpServletRequest req, Model model,HttpSession session) // changes the user information in database
	{
		String newName = req.getParameter("name");
		String newEmail = req.getParameter("email");
		boolean change_psw = false;
		String newPassword = req.getParameter("NP");
		if(newPassword != "")
			change_psw = true;
		String current = DigestUtils.md5DigestAsHex(req.getParameter("CP").getBytes());
		
		User cu = userservice.getByID(Integer.parseInt(session.getAttribute("ActiveUserID").toString()));
		if(cu.getPassword().equalsIgnoreCase(current))
		{
			model.addAttribute("msg", "Ok");
			if(newEmail != "")
				cu.setEmail(newEmail);
			if(newName != "")
				cu.setName(newName);
			if(change_psw)
				cu.setPassword(DigestUtils.md5DigestAsHex(newPassword.getBytes()));
			userservice.update(cu);
		}
		else
			model.addAttribute("msg", "ERROR !!! \n Values Cannot be Updated");
		return "editUser";
	}
	
	@GetMapping(value="/friends1")
	public String getFriends1(HttpSession session, Model model) // Get Information of user sharing my(User's) document 
	{
		Integer id = (Integer) session.getAttribute("ActiveUserID");
		List<Integer> friendsID = share.friendsID(id);
		String table = "<thead><tr><th scope='col'>ID</th><th scope='col'>Full Name</th>"
				+ "<th scope='col'>Email</th><th scope='col'>Is Admin</th></tr></thead><tbody>";
		for(int i=0;i<friendsID.size();i++)
		{
			User u = userservice.getByID(friendsID.get(i));
			table = table + "<tr><td scope='row'>" + u.getUserID().toString() + "</td><td scope='row'>" + u.getName() +
					"</td><td scope='row'>" + u.getEmail() + "</td><td scope='row'>" + u.isAdmin() + "</td></tr>";
		}
		model.addAttribute("table1", table);
		return "friends";
	}
	
	@GetMapping(value="/friends2")
	public String getFriends2(HttpSession session, Model model) // Get Information of user sharing document with me 
	{
		Integer id = (Integer) session.getAttribute("ActiveUserID");
		List<Integer> friendsID = share.friendID_received(id);
		String table = "<thead><tr><th scope='col'>ID</th><th scope='col'>Full Name</th>"
				+ "<th scope='col'>Email</th><th scope='col'>Is Admin</th></tr></thead><tbody>";
		for(int i=0;i<friendsID.size();i++)
		{
			User u = userservice.getByID(friendsID.get(i));
			table = table + "<tr><td scope='row'>" + u.getUserID().toString() + "</td><td scope='row'>" + u.getName() +
					"</td><td scope='row'>" + u.getEmail() + "</td><td scope='row'>" + u.isAdmin() + "</td></tr>";
		}
		model.addAttribute("table2", table);
		return "friends";
	}
	
	@RequestMapping(value="/getCategory",method = RequestMethod.POST, produces = "application/xml")
	public @ResponseBody List<Category> getCategory() // return available categories
	{
		return cs.getAllactive();
	}
	
	@RequestMapping(value = "/getDetails",method = RequestMethod.POST, produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody ResponseEntity<Content> getDetails(@RequestBody String ID) // gets details of document with ID
	{
		Integer docID = Integer.parseInt(ID);
		Document d = doc.getByID(docID);
		String s = "File Path = " + d.getLocation() + d.getTitle() + "<br>Shared With: " + share.acc_doc(docID);
		s = s + "<br>Categories: " + dc.allCategory(d);
		return new ResponseEntity<Content>(new Content(docID, s), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/getDocument",method = RequestMethod.POST, produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody ResponseEntity<Content> getDocument(@RequestBody String ID) // opens the selects file and sends it data
	{	
		Integer id = Integer.parseInt(ID);
		try
		{
			Document d = doc.getByID(id);
			String content = "";
			FileReader f = new FileReader(d.getLocation() + d.getTitle());
			BufferedReader br = new BufferedReader(f);
			int c=0;
			while((c = br.read()) != -1)
			{
				content = content + (char) c;
			}
			br.close();
			f.close();
			return new ResponseEntity<Content>(new Content(id, content), HttpStatus.OK);
		}
		catch(Exception e)
		{
			return new ResponseEntity<Content>(new Content(), HttpStatus.OK);
		}
	}
	
	@RequestMapping(value = "/history",method = RequestMethod.POST, produces = {MediaType.APPLICATION_XML_VALUE}) // displays the log history of shared documents
	public @ResponseBody List<File_Edit> History_shared(HttpSession session)
	{
		Integer id = (Integer) session.getAttribute("ActiveUserID");
		return log.getMyShareLogs(id);
	}
	
	@RequestMapping(value = "/historyFriend",method = RequestMethod.POST, produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody List<File_Edit> History_of_Other(HttpSession session) // log of history of others document that user have access
	{
		Integer id = (Integer) session.getAttribute("ActiveUserID");
		List<Integer> shareList_Docs = share.getDoc_ids(id);
		return log.getLogOf(shareList_Docs, id);
	}
	
	@RequestMapping("login")
	public String loginpage(Model m) // shows page for user login
	{
		if(this.a)
			m.addAttribute("msg","Failed to log in . Try Again");
		return "login";
	}
	
	@RequestMapping(value = "loginU", method = RequestMethod.POST)
	public ModelAndView loginU(@ModelAttribute User user, ModelMap model, HttpSession session) // makes user login
	{
        try
		{
			User u = userservice.login(user);
			session.setAttribute("ActiveUserID", u.getUserID());
			return new ModelAndView("redirect:/userpage", model);
		}
		catch(RuntimeException e)
		{
			this.a = true;
			return new ModelAndView("redirect:/login",model);
		}
    }
	
	@GetMapping("logout")
	public String logout(HttpSession session) // logout user
	{
		session.invalidate();
		return "index";
	}
	
	@RequestMapping(value = "/mySHAREDdocument",method = RequestMethod.POST, produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody List<Content> mySHAREDdocumente(HttpSession session) // shows the list of documents that are shared
	{
		Integer UserId = (Integer) session.getAttribute("ActiveUserID");
		List<Integer> docIDs = share.my_shared_doc(UserId);
		List<Integer> docS = new ArrayList<Integer>();
		for(int i=0;i<docIDs.size();i++)
		{
			if(!docS.contains(docIDs.get(i)))
			{
				docS.add(docIDs.get(i));
			}
		}
		List<Content> finalList = new ArrayList<Content>();
		for(int i=0;i<docS.size();i++)
		{
			finalList.add(new Content(docIDs.get(i), share.acc_doc(docS.get(i))));
		}
		return finalList;
	}
	
	@PostMapping("/register")
	public String register(HttpServletRequest req, Model model) // Add user data in database
	{
		User u = new User();
		u.setEmail(req.getParameter("email"));
		u.setName(req.getParameter("name"));
		u.setPassword(req.getParameter("password"));
		u.setActive(true);
		u.setApproved(false);
		u.setDate_of_joined(java.time.LocalDate.now());
		u.setTime_of_joined(java.time.LocalTime.now());
		
		if(userservice.EMail(u.getEmail()))
		{
			userservice.register(u);
			String dir = Integer.toString(u.getUserID());
			File f = new File("/home/ramkumar/Spring/Documents/" + dir);
			if(f.mkdir()==true)
			{
				model.addAttribute("msg", "Registration made. Enter data again for login if you have admin approval.");
				return "login";
			}
			else
			{
				model.addAttribute("msg", "Registration made but remained incomplete. Contact admin.");
				return "login";
			}
			
		}
		else
		{
			model.addAttribute("msg", "Email used by another user.");
			return "signUp";
		}
	}
	
	@RequestMapping(value="/removeCategory",method = RequestMethod.POST,
			headers = "Accept=*/*",produces = "application/json", consumes="application/json")
	public @ResponseBody boolean removeCategory(@RequestBody Content input) // removes document from category
	{
		Document d = doc.getByID(input.getId());
		Integer cid = Integer.parseInt(input.getData());
		List<Document_Category> allCategory = dc.ALL(d);
		for(int i=0;i<allCategory.size();i++)
		{
			if(allCategory.get(i).getCategory().getID()==cid)
			{
				dc.delete(allCategory.get(i).getID());
				return true;
			}
		}
		return false;
	}
	
	@RequestMapping(value="/saveDocument",method = RequestMethod.POST,
			headers = "Accept=*/*",produces = "application/json", consumes="application/json")
	public @ResponseBody boolean saveDoc(@RequestBody Content input, HttpSession session) // changes the content of file
	{
		try
		{
			Document d = doc.getByID(input.getId());
			Integer user_ID = Integer.parseInt(session.getAttribute("ActiveUserID").toString());
			
			FileReader fd = new FileReader(d.getLocation() + d.getTitle());
			String oldfile = d.getLocation() + java.time.LocalDate.now().toString() + d.getTitle();
			FileWriter nf = new FileWriter(oldfile);
			fd.transferTo(nf);
			fd.close();
			nf.close();
			
			File_Edit fe = new File_Edit(java.time.LocalDate.now(),java.time.LocalTime.now(),user_ID,d.getID(), oldfile, "e");
			log.save(fe);
			
			FileWriter fw = new FileWriter(d.getLocation() + d.getTitle());
			fw.write(input.getData());
			fw.close();
			return true;
		}
		catch(Exception e)
		{
			return false;
		}
	}
	
	@RequestMapping(value="/search",method = RequestMethod.POST,
			headers = "Accept=*/*",produces = "application/xml", consumes="application/json")
	public @ResponseBody List<Document> search(@RequestBody Content input, HttpSession session) // list of searched documents
	{
		Integer user_ID = Integer.parseInt(session.getAttribute("ActiveUserID").toString());
		List<Document> doc_list = userservice.getByID(user_ID).getDocumentList();
		doc_list.stream().map(Document->
		{
			Document.setUser(null);
			return Document;
		}).collect(Collectors.toList());
		
		List<Document> final_list = new ArrayList<Document>();
		String SN = input.getData().toLowerCase();
		for(int i=0;i<doc_list.size();i++)
		{
			int index = doc_list.get(i).getTitle().toLowerCase().indexOf(SN);
			if(index > -1)
			{
				final_list.add(doc_list.get(i));
			}
		}
		
		if(input.getId()==0)
			return final_list;
		List<Document> result = new ArrayList<Document>();
		Category category = cs.getByID(input.getId());
		
		for(int i=0;i<final_list.size();i++)
		{
			Document d = final_list.get(i);
			List<String> name = dc.allCategoryName(d);
			for(int j=0;j<name.size();j++)
			{
				if(name.get(j).compareToIgnoreCase(category.getName())==0)
				{
					result.add(d);
					break;
				}
			}
		}
		return result;
	}
	
	@RequestMapping(value="/shareDocument",method = RequestMethod.POST,produces = {MediaType.APPLICATION_XML_VALUE})
	//		headers = "Accept=*/*",produces = MediaType.APPLICATION_XML_VALUE, consumes="application/json")
	public @ResponseBody ResponseEntity<Content> share(@RequestBody Content input, HttpSession session) // shares the documents with others
	{
		Integer userId = (Integer) session.getAttribute("ActiveUserID");
		if(userservice.checkUser(Integer.parseInt(input.getData())))
		{
			Integer i = share.get_saved_id(userId, input.getId(), Integer.parseInt(input.getData()));
			System.out.println("Id of shared table = " + i);
//			if(i==0)
//				return new ResponseEntity<Content>(new Content("!!! ERROR !!! Cannot Share the file."), HttpStatus.OK);
//			Shared saved = share.getByID(i);
//			if(saved!=null)
//				return new ResponseEntity<Content>(new Content("File Already shared."), HttpStatus.OK);
			
			if(i==0) // no entry in table shared, so adding entry
			{
				Shared s = new Shared(userId,input.getId(),Integer.parseInt(input.getData()));
				share.save(s);
				File_Edit fe = new File_Edit(java.time.LocalDate.now(),java.time.LocalTime.now(),userId,input.getId(), input.getData(), "s");
				log.save(fe);
				return new ResponseEntity<Content>(new Content("Successfully shared this file."), HttpStatus.OK);
			}
			else if(i>0) // entry already exist in database
				return new ResponseEntity<Content>(new Content("File Already shared."), HttpStatus.OK);
			else
				return new ResponseEntity<Content>(new Content("!!! ERROR !!! Cannot Share the file."), HttpStatus.OK);
		}
		return new ResponseEntity<Content>(new Content("ERROR. Could not share this file. !!! User not available."), HttpStatus.OK);
	}
	
	@RequestMapping(value="showdocument",method = RequestMethod.POST, 
			produces = {MediaType.APPLICATION_XML_VALUE})
	@ResponseBody
	public List<Document> showdocument(HttpSession session) // returns the list of all document of user
    {
//		List<Document> doc_list = Arrays.asList(new Document(1, "Sample Document", "/Spring"),
//				new Document(3, "ne.txt", "/home/ramkumar/RAM/"));
		if ((Integer) session.getAttribute("ActiveUserID")==null)
			return null;
		List<Document> doc_list = userservice.getByID((Integer) session.getAttribute("ActiveUserID")).getDocumentList();
		doc_list.stream().map(Document->
		{
			Document.setUser(null);
			return Document;
		}).collect(Collectors.toList());
		return doc_list;
    }
	
	@RequestMapping(value="showSHAREDdocument",method = RequestMethod.POST, produces = {MediaType.APPLICATION_XML_VALUE})
	@ResponseBody
	public List<Document> showSHAREDdoc(HttpSession session) // returns the list of all document of other users shared
    {
		Integer userID = (Integer) session.getAttribute("ActiveUserID");
		if (userID==null)
			return null;
		List<Integer> doc_ids = share.getDoc_ids(userID);
		List<Document> docs = new ArrayList<Document>();
		try
		{
			for(int i=0;i<doc_ids.size();i++)
			{
				Document d = doc.getByID(doc_ids.get(i));
				docs.add(new Document(d.getID(), d.getTitle(), d.getUser().getUserID().toString()));
			}
			return docs;
		}
		catch(Exception e)
		{
			return null;
		}
    }
	
	@GetMapping("/signup")
	public String signup() // show page for user registration
	{
		return "signUp";
	}
	
	@RequestMapping("/userpage")
	public String userpage(HttpSession session, Model model) // displays the page where all information for user is shown
	{
		this.a = false;
		try
		{
			User u = userservice.getByID((Integer) session.getAttribute("ActiveUserID"));
			model.addAttribute("name", u.getName());
			model.addAttribute("id", u.getUserID());
			return "userpage";
		}
		catch(Exception e)
		{
			model.addAttribute("msg","Log in to use this page.");
			return "login";
		}
	}
	
	@PostMapping(value="/update", produces = "application/xml")
	public @ResponseBody boolean updateFile( @RequestParam("file") MultipartFile file, @RequestParam("id") Integer docID, HttpSession session, Model model ) // update file in server
	{
		try
		{
			String fileName = file.getOriginalFilename();
			Document d = doc.getByID(docID);
			Integer user_ID = Integer.parseInt(session.getAttribute("ActiveUserID").toString());
			
			String oldfile = d.getLocation() + java.time.LocalDate.now().toString() + d.getTitle();
			
			File existing = new File(d.getLocation()+d.getTitle());
			File rename = new File(oldfile);
			if(existing.renameTo(rename))
			{
				file.transferTo(new File(d.getLocation()+d.getTitle()));
			}
	   		File_Edit fe = new File_Edit(java.time.LocalDate.now(),java.time.LocalTime.now(),user_ID,d.getID(), oldfile, "e");
			log.save(fe);
			return true;
		}
		catch(Exception e)
		{
			return false;
		}
	}
	
	@PostMapping("/upload")
	public String Upload_File(@RequestParam("file") MultipartFile file, @RequestParam("category") String category, HttpSession session, Model model ) // upload file in server
	{
	    String fileName = file.getOriginalFilename();
	    if ((Integer) session.getAttribute("ActiveUserID")!=null)
	    {
	    	Integer id = Integer.parseInt(session.getAttribute("ActiveUserID").toString());
	    	try 
		    {
	    		String full_path = "/home/ramkumar/Spring/Documents/" + session.getAttribute("ActiveUserID") + "/" +fileName;
	    		File fc = new File(full_path);
	    		if(fc.exists())
	    		{
	    			model.addAttribute("msg", "Cannot upload file. File with same name exist.");
	    			return "file_uploader";
	    		}
	    		file.transferTo(fc);
	    		Document d = new Document(fileName, "/home/ramkumar/Spring/Documents/" + session.getAttribute("ActiveUserID") + "/");
	    		d.setUser(userservice.getByID((Integer) session.getAttribute("ActiveUserID")));
	    		doc.save(d);
	    		File_Edit f = new File_Edit(java.time.LocalDate.now(),java.time.LocalTime.now(), id, d.getID(), "u");
	    		log.save(f);
	    		Category c = cs.getByID(Integer.parseInt(category));
	    		if(c==null)
	    		{
	    			model.addAttribute("msg", "Cannot saved in mentioned category. So no category given to this file.");
	    			return "file_uploader";
	    		}
	    		Document_Category DC = new Document_Category(d, c);
	    		dc.save(DC);
	    		return "userpage";
		    } 
		    catch (Exception e) 
		    {
		    	//model.addAttribute("userModel", new User());
				model.addAttribute("msg", HttpStatus.INTERNAL_SERVER_ERROR);
		    	return "ajax";
		    }
	    }
	    else
	    {
	    	model.addAttribute("userModel", new User());
			model.addAttribute("msg", "!!! Please Do login First !!!");
			return "login";
	    }
	}
	
	@GetMapping("/uploader")
	public String uploader() // displays the page to upload the file
	{
		return "file_uploader";
		//return "ajax";
	}
	
	@RequestMapping(value="/unShare",method = RequestMethod.POST,produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody ResponseEntity<Content> unshare(@RequestBody Content input, HttpSession session) // Unshared selected documents with selected id
	{
		Integer userId = (Integer) session.getAttribute("ActiveUserID");
		Integer unshare_with = share.get_saved_id(userId, input.getId(), Integer.parseInt(input.getData()));
		if(unshare_with==0)
			return new ResponseEntity<Content>(new Content("!!! ERROR !!!"), HttpStatus.OK);
		File_Edit l = new File_Edit(java.time.LocalDate.now(), java.time.LocalTime.now(), userId, input.getId(), input.getData(), "x");
		log.save(l);
		share.deleteByID(unshare_with);
		return new ResponseEntity<Content>(new Content("Selected document made unaccessable to selected user. Reload page for confirmation"), HttpStatus.OK);
	}
}
