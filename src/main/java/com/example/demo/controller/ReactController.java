package com.example.demo.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

@CrossOrigin(origins = "http://127.0.0.1:3000/")
@RestController
@RequestMapping("api/")
public class ReactController
{
	@Autowired
	private UserServiceImp user;
	
	@Autowired
	private CategoryServiceImp cs;
	
	@Autowired
	private DocumentService doc;
	
	@Autowired
	private File_EditSImp log;
	
	@Autowired
	private Document_CategorySImp dc;
	
	@Autowired
	private SharedServiceImp share;
	
	private String root_path = "/home/ramkumar/Spring/Documents/"; // root path for files and folders
	
	@PostMapping(value="categoryAdd", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody String categoryADD(@RequestBody Content c, HttpSession session) // add category to document
	{
		try
		{
			Document d = doc.getByID(c.getId());
			Integer userID = (Integer) session.getAttribute("ActiveUserID");
			if(d.getUser().getUserID()!=userID)
				return "You cannot change the category of document that does not belongs to you.";
			Category C = cs.getByID(Integer.parseInt(c.getData()));
			Document_Category DC = new Document_Category(d,C);
			if(dc.check(DC))
				return "Document Already Belongs to mentioned category.";
			dc.save(DC);
			return "Document with given id added to mentioned category.";
		}
		catch(Exception e)
		{
			return "ERROR => " + e.getMessage();
		}
	}
	
	@PostMapping(value="/categoryCreate", consumes="application/json", produces = {MediaType.APPLICATION_XML_VALUE}) // create new category
	public @ResponseBody String categoryCreate(@RequestBody Category c) // creates new category
	{
		if(Integer.parseInt(c.getCreated_by())==0)
			return "You must be logged in to create category";
		if(c.isActive())
			c.setActive(false);
		else
			c.setActive(true);
		cs.save(c);
		return "Category Created";
	}
	
	@PostMapping(value="categoryDelete")
	public String categoryDelete(@RequestBody Content c) // delete the category
	{
		String userID = c.getData();
		Category category = cs.getByID(c.getId());
		if(category.getCreated_by().compareToIgnoreCase(userID)!=0)
			return "You cannot delete the category that is not created by you.";
		dc.delete_Category(category);
		cs.delete(category.getID());
		return "DONE";
	}
	
	@PostMapping(value="categoryUpdate")
	public @ResponseBody String categoryUpdate(@RequestBody Category input, HttpSession session) // updates existing category
	{
		Category c = cs.getByID(input.getID());
		if(c==null)
			return "ERROR!!!<br>Category with given id does not exist.";
		if(c.getCreated_by().compareToIgnoreCase(session.getAttribute("ActiveUserID").toString())!=0)
			return "You cannot edit category that belongs to other!!!";
		if(input.isActive())
			c.setActive(false);
		else
			c.setActive(true);
		String e = "";
		if(input.getDescription().compareToIgnoreCase(e)!=0)
			c.setDescription(input.getDescription());
		if(input.getName().compareToIgnoreCase(e)!=0)
			c.setName(input.getName());
		cs.save(c);
		return "Values Updated";
	}
	
	@RequestMapping(value="changeFileName",method = RequestMethod.POST,headers = "Accept=*/*",produces = "application/json", consumes="application/json")
	public @ResponseBody boolean changeFileName(@RequestBody Content input, HttpSession session) //changes the title(filename) of document
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
	
	@PostMapping(value="changePath", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody String changePath(@RequestBody Content input, HttpSession session) // move file
	{
		Integer userID = (Integer) session.getAttribute("ActiveUserID");
		Document d = doc.getByID(input.getId());
		File file = new File(d.getLocation() + d.getTitle());
		String newLocation = root_path + userID + "/" + input.getData() + "/" + d.getTitle();
		if(newLocation.compareTo(d.getLocation()+d.getTitle())==0)
			return "The file cannot be moved to same location in which it is placed.";
		if(file.renameTo(new File(newLocation)))
		{
			if(input.getData().compareTo("/")==0)
				d.setLocation(root_path + userID + "/");
			else
				d.setLocation(root_path + userID + "/" + input.getData() + "/");
			doc.save(d);
			return "File Moved.";
		}
		return "CANNOT MOVED THE FILE";
	}
	
	@PostMapping(value="categoryRemove", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody String categoryRemove(@RequestBody Content input, HttpSession session) // removes document from category
	{
		Document d = doc.getByID(input.getId());
		Integer userID = (Integer) session.getAttribute("ActiveUserID");
		if(d.getUser().getUserID()!=userID)
			return "You cannot change the category of document that does not belongs to you.";
		Integer cid = Integer.parseInt(input.getData());
		List<Document_Category> allCategory = dc.ALL(d);
		for(int i=0;i<allCategory.size();i++)
		{
			if(allCategory.get(i).getCategory().getID()==cid)
			{
				dc.delete(allCategory.get(i).getID());
				return "Document removed from given category.";
			}
		}
		return "The mentioned document does not belongs to mentioned category. So, no change made.";
	}
	
	@PostMapping(value="changeDescription") // change description of file
	public String changeDescription(@RequestBody Content input)
	{
		Document d = doc.getByID(input.getId());
		d.setDescription(input.getData());
		doc.save(d);
		return "Done";
	}
	
	@PostMapping(value="changeDate") // change date of file
	public String changeDate(@RequestBody Content input)
	{
		Document d = doc.getByID(input.getId());
		d.setDate(Date.valueOf(input.getData()));
		doc.save(d);
		return "Done";
	}
	
	@PostMapping(value="/delete", produces={MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody String deletefile(@RequestBody Content input, HttpSession session) // deletes the file
	{
		try
		{
			Integer id = input.getId();
			Document d = doc.getByID(id);
			File file = new File(d.getLocation() + d.getTitle());
			String path = d.getLocation() + "DEL_" + d.getTitle();
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
				share.deleteALLshares(id, user_ID);
				return "Selected File Deleted";
			}
			return "!!!Some error occurred!!!";
		}
		catch(Exception e)
		{
			return "ERROR. Reason => " + e.getMessage();
		}
	}
	
	@PostMapping(value="deleteUser", produces = {MediaType.APPLICATION_XML_VALUE})
	public boolean deleteUser(@RequestBody Content C, HttpSession session) // deletes user
	// user is actually not deleted but is made unable to log in
	{
		User u = user.getByID(C.getId());
		String current = DigestUtils.md5DigestAsHex(C.getData().getBytes());
		if(u.getPassword().equalsIgnoreCase(current))
		{
			u.setActive(false);
			u.setDate_Left(java.time.LocalDate.now());
			user.deleteUser(u);
			session.invalidate();
			return true;
		}
		else
			return false;
	}
	
	@RequestMapping(value="documentByCategory", method=RequestMethod.POST, produces= {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody String documentByCategory(HttpSession session) // all document with its category
	{
		Integer id = (Integer) session.getAttribute("ActiveUserID");
		String data = "<A>";
		List<Document> DL = user.getByID(id).getDocumentList();
		for(int i=0;i<DL.size();i++)
		{
			data = data + "<doc><id>" + DL.get(i).getID() + "</id><name>" + DL.get(i).getTitle() +"</name><category>";
			List<Category> cl = dc.doc_Category(DL.get(i));
			for(int j=0;j<cl.size();j++)
			{
				data = data + "<a><cid>" + cl.get(j).getID() +"</cid><cname>" + cl.get(j).getName() +"</cname></a>";
			}
			data = data + "</category></doc>";
		}
		data = data + "</A>";
		return data;
	}
	
	public List<Content> folder(List<Content> f, String path, int depth) // search folder
	{
		if(depth > 7)
		{
			return f;
		}
		depth = depth + 1;
		File file = new File(path);
		String[] sd = file.list();
		if(sd==null)
			return f;
		for (String element: sd)
		{
			File f1 = new File(path + element);
			if(f1.isDirectory())
			{
				String f_name = path + element;
				f.add(new Content(f_name.replace(root_path, "").substring(2)));
				folder(f,path + element + "/",depth);
			}
		}
		return f;
	}
	
	@PostMapping(value="folderAfiles", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody List<Document> folderAfiles(@RequestBody Content c, HttpSession session) // all files and folders
	{
		Integer id = (Integer) session.getAttribute("ActiveUserID");
		String path = root_path + id + c.getData();
		File directoryPath = new File(path);
		File filesList[] = directoryPath.listFiles();
		
		List<Document> list = new ArrayList<Document>();
		for(File file : filesList)
		{
			if(file.isDirectory())
				list.add(new Document(0, file.getName(), file.getAbsolutePath()));
		}
		List<Integer> files = doc.files_of_location(path, id);
		for(int i=0;i<files.size();i++)
		{
			Document d = doc.getByID(files.get(i));
			d.setUser(null);
			list.add(d);;
		}
		return list;
	}
	
	@GetMapping(value="folderList", produces = {MediaType.APPLICATION_XML_VALUE}) // gets all folders
	public @ResponseBody List<Content> folderList(HttpSession session)
	{
		String id = session.getAttribute("ActiveUserID").toString();
		List<Content> f = new ArrayList<Content>();
		String path = root_path + id + "/";
		return folder(f, path, 0);
	}
	
	@PostMapping("folderRemove")
	public String folderRemove(@RequestBody Content c) // deleted a folder from server
	{
		File sDir = new File(root_path + c.getId() + c.getData());
		if(sDir.isDirectory())
		{
			if(sDir.delete())
				return "Folder with given name in current location deleted.";
			else
				return "The folder is not empty. Remove any files or folders in given folder to delete it.";
		}
		return "!!! ERROR OCCURRED !!!";
	}
	
	@PostMapping("folderREname")
	public String folderREname(@RequestBody Document d) // rename folder
	{
		// d.title => present_name, d.location => location, d.description => new_name
		String userID = Integer.toString(d.getID());
		File sDir = new File(root_path + userID + d.getLocation() + d.getTitle());
		File dest = new File(root_path + userID + d.getLocation() + d.getDescription());
		String parent = root_path + userID + d.getLocation();
		if(sDir.isDirectory())
			return "ERROR!!! Folder with given name not found in this location.";
		if(sDir.renameTo(dest))
		{
			List<Integer> docIDs = doc.files_in_folder(parent, d.getID());
			for(int i=0;i<docIDs.size();i++)
			{
				Document d1 = doc.getByID(docIDs.get(i));
				String toappend = d1.getLocation().substring(parent.length() + d.getTitle().length());
				d1.setLocation(root_path + userID + d.getLocation() + d.getDescription() + toappend);
				doc.save(d1);
			}
			return "The selected folder is renamed.";
		}
		return "Could not rename the folder.";
	}
	
	@PostMapping(value="friends", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody String friends(@RequestBody Content userid) // details of other user
	{
		List<Integer> friendsID1 = share.friendsID(userid.getId()); // Get Information of user sharing my(userid's) document
		List<Integer> friendsID2 = share.friendID_received(userid.getId()); // Get Information of user sharing document with me(userid)
		
		String table = "<A><table><thead><tr><th scope='col'>ID</th>"
				+ "<th scope='col'>Full Name</th><th scope='col'>Email</th><th scope='col'>Is Admin</th></tr></thead><tbody>";
		for(int i=0;i<friendsID1.size();i++)
		{
			User u = user.getByID(friendsID1.get(i));
			table = table + "<tr><td scope='row'>" + u.getUserID().toString() + "</td><td scope='row'>" + u.getName() +
					"</td><td scope='row'>" + u.getEmail() + "</td><td scope='row'>" + u.isAdmin() + "</td></tr>";
		}
		//
		table = table + "</tbody></table><p>Information of user sharing document with me</p><table><thead><tr>"
			+ "<th scope='col'>ID</th><th scope='col'>Full Name</th><th scope='col'>Email</th><th scope='col'>Is Admin</th></tr></thead><tbody>";
		for(int i=0;i<friendsID2.size();i++)
		{
			User u = user.getByID(friendsID2.get(i));
			table = table + "<tr><td scope='row'>" + u.getUserID().toString() + "</td><td scope='row'>" + u.getName() +
					"</td><td scope='row'>" + u.getEmail() + "</td><td scope='row'>" + u.isAdmin() + "</td></tr>";
		}
		table = table + "</tbody></table></A>";
		return table;
	}
	
	@PostMapping(value="getAllDocument", consumes="application/json", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody List<Document> getAllDocument(@RequestBody Content userid) // returns the list of all document of user
    {
		List<Document> doc_list = user.getByID(userid.getId()).getDocumentList();
		doc_list.stream().map(Document->
		{
			Document.setUser(null);
			return Document;
		}).collect(Collectors.toList());
		return doc_list;
    }
	
	@PostMapping(value="getCategory", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody List<Category> getCategory() // returns the list of all available(active) category
    {
		return cs.getAllactive();
    }
	
	@PostMapping(value="getCategoryALL", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody List<Category> getCategoryALL(HttpSession session) // returns the list of all category
    {
		String UserId = session.getAttribute("ActiveUserID").toString();
		return cs.getAllBy_user(UserId);
    }
	
	@GetMapping(value="getDetails/{id}", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody ResponseEntity<Content> getDetails(@PathVariable("id") String ID) // details of a document
	{
		Integer docID = Integer.parseInt(ID);
		Document d = doc.getByID(docID);
		String s = "<br>File Name: <a id='FName'>" + d.getTitle() + "</a>";
		s = s + "<br>File Path = " + d.getLocation() + d.getTitle() + "<br>Shared With: " + share.acc_doc(docID);
		s = s + "<br>Categories: " + dc.allCategory(d) + "<br>Date: " + d.getDate() + "<br>Description: " +d.getDescription(); 
		return new ResponseEntity<Content>(new Content(docID, s), HttpStatus.OK);
	}
	
	@RequestMapping(value = "History_of_Other",method = RequestMethod.GET, produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody List<File_Edit> History_of_Other(HttpSession session) // log of history of others document that user have access
	{
		Integer id = (Integer) session.getAttribute("ActiveUserID");
		List<Integer> shareList_Docs = share.getDoc_ids(id);
		return log.getLogOf(shareList_Docs, id);
	}
	
	@GetMapping(value="information", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody User information(HttpSession session) // information about user
	{
		Integer id = (Integer) session.getAttribute("ActiveUserID");
		User u = user.getByID(id);
		User U = new User();
		U.setDate_of_joined(u.getDate_of_joined());
		U.setEmail(u.getEmail());
		U.setUserID(id);
		U.setName(u.getName());
		return U;
	}
	
	@PostMapping(value="login", consumes="application/json")
	public @ResponseBody Content login(@RequestBody User input, HttpSession session) // user login
	{
		try
		{
			User u = user.login(input);
			session.setAttribute("ActiveUserID", u.getUserID());
			return new Content(u.getUserID(), u.getName());
		}
		catch(Exception e)
		{
			return new Content(0, e.getMessage());
		}
	}
	
	@PostMapping(value="logout", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody boolean logout(HttpSession session) // user logout
	{
		session.invalidate();
		return true;
	}
	
	@PostMapping(value="makeDocPublic", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody String makeDocPublic(@RequestBody Content docID, HttpSession session) // make document accessible to all user
	{
		Integer UserId = (Integer) session.getAttribute("ActiveUserID");
		Integer i = share.get_saved_id(UserId, docID.getId(), 0);
		if(i==0) // no entry in table shared, so adding entry
		{
			Shared s = new Shared(UserId, docID.getId(), 0);
			share.save(s);
			File_Edit fe = new File_Edit(java.time.LocalDate.now(),java.time.LocalTime.now(),UserId,docID.getId(), "0", "s");
			log.save(fe);
			return "Mentioned document made accessible to all users.";
		}
		else
			return "The mentioned document is already accessible to all users.";
	}
	
	@PostMapping(value="makeDocUNPublic", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody String makeDocUNPublic(@RequestBody Content docID, HttpSession session)// make document un-accessible to all user
	{
		Integer UserId = (Integer) session.getAttribute("ActiveUserID");
		Integer i = share.get_saved_id(UserId, docID.getId(), 0);
		if(i==0) // no entry in table shared
		{
			return "Mentioned document is not accessible to general public(other users).";
		}
		else
		{
			Shared s = share.getByID(i);
			share.delete(s);
			File_Edit fe = new File_Edit(java.time.LocalDate.now(),java.time.LocalTime.now(),UserId,docID.getId(), "0", "x");
			log.save(fe);
			return "Mentioned document made unaccessible to general public(other users).";
		}
	}
	
	@RequestMapping(value = "/mySHAREDdocument",method = RequestMethod.POST, produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody List<Document> mySHAREDdocumente(HttpSession session) // shows the list of documents that are shared
	{
		Integer UserId = (Integer) session.getAttribute("ActiveUserID");
		List<Integer> docIDs = share.my_shared_doc(UserId);
		List<Document> finalList = new ArrayList<Document>();
		for(int i=0;i<docIDs.size();i++)
		{
			Document d = doc.getByID(docIDs.get(i));
			Document D = new Document();
			String shared_info = "";
			List<Integer> friends = share.acc_doc_list(d.getID());
			for(int j=0;j<friends.size();j++)
			{
				User f = user.getByID(friends.get(j));
				shared_info = shared_info + f.getName() + "(" + f.getUserID() + "),";
				D.setLocation(shared_info);
			}
			D.setID(d.getID());
			D.setTitle(d.getTitle());
			finalList.add(D);
		}
		return finalList;
	}
	
	@RequestMapping("openFILE/{id}")
	public void openFILE(HttpServletResponse response, @PathVariable("id") String id) // option to download file
	{
			try
			{
				Document document = doc.getByID(Integer.parseInt(id));
				String fileName = document.getTitle();
				Path file = Paths.get(document.getLocation(), document.getTitle());
				response.setContentType("APPLICATION/OCTET-STREAM");
				response.addHeader("Content-Disposition", "attachment;filename="+fileName);
				Files.copy(file, response.getOutputStream());
				response.getOutputStream().flush();
			}
			catch(Exception e)
			{
				System.out.println("ERROR -> " + e.getMessage());
			}
	}
	
	@PostMapping(value="/register", produces = {MediaType.APPLICATION_XML_VALUE})
	public Content register(@RequestBody User input) // Add user data in database
	{
		input.setActive(true);
		input.setApproved(false);
		input.setDate_of_joined(java.time.LocalDate.now());
		input.setTime_of_joined(java.time.LocalTime.now());
		if(user.EMail(input.getEmail()))
		{
			user.register(input);
			String dir = Integer.toString(input.getUserID());
			File f = new File(root_path + dir);
			if(f.mkdir()==true)
				return new Content(1, "Registration made. Enter data again for login if you have admin approval.");
			else
				return new Content(2, "Registration made but remained incomplete. Contact admin.");
		}
		else
			return new Content(0, "Email used by another user.");
	}
	
	@PostMapping(value="/search", produces = "application/xml", consumes="application/json")
	public @ResponseBody List<Document> search(@RequestBody Document input, HttpSession session) // list of searched documents
	{
		Integer user_ID = Integer.parseInt(session.getAttribute("ActiveUserID").toString());
		List<Document> doc_list = user.getByID(user_ID).getDocumentList();
		doc_list.stream().map(Document->
		{
			Document.setUser(null);
			return Document;
		}).collect(Collectors.toList());
		
		// check names
		List<Document> final_list = new ArrayList<Document>();
		String SN = input.getTitle().toLowerCase();
		for(int i=0;i<doc_list.size();i++)
		{
			int index = doc_list.get(i).getTitle().toLowerCase().indexOf(SN);
			if(index > -1)
			{
				final_list.add(doc_list.get(i));
			}
		}
		
		// category filter
		if(input.getID()>0)
		{
			Category category = cs.getByID(input.getID());
			
			for(int i=0;i<final_list.size();i++)
			{
				Document d = final_list.get(i);
				List<String> name = dc.allCategoryName(d);
				for(int j=0;j<name.size();j++)
				{
					if(name.get(j).compareToIgnoreCase(category.getName())!=0)
					{
						final_list.remove(d);
						break;
					}
				}
			}
		}
		
		//with year filter
		Integer year = input.getDate().getYear();
		if((year + 1900)>2077)
		{
			for(int i=0;i<final_list.size();i++)
			{
				Document d = final_list.get(i);
				try
				{
					if(d.getDate().getYear()!=year)
						final_list.remove(d);
				}
				catch(Exception e)
				{
					final_list.remove(d);
				}
			}
		}
		
		// with month filter
		Integer month = input.getDate().getMonth();
		Integer day = input.getDate().getDate();
		if(day == 2)
		{
			for(int i=0;i<final_list.size();i++)
			{
				Document d = final_list.get(i);
				try
				{
					if(d.getDate().getMonth()!=month)
						final_list.remove(d);
				}
				catch(Exception e)
				{
					final_list.remove(d);
				}
			}
		}
		
		// with folder filter
		if(input.getDescription().compareToIgnoreCase("root")!=0)
		{
			for(int i=0;i<final_list.size();i++)
			{
				int index = doc_list.get(i).getLocation().toLowerCase().indexOf(input.getDescription());
				if(index == -1)
				{
					Document d = final_list.get(i);
					final_list.remove(d);
				}
			}
		}
		//
		return final_list;
	}
	
	@PostMapping(value="shareDocument", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody ResponseEntity<Content> share(@RequestBody Content input, HttpSession session) // shares the documents with others
	{
		Integer userId = (Integer) session.getAttribute("ActiveUserID");
		if(user.checkUser(Integer.parseInt(input.getData()))) // id of other user checked 
		{
			Integer i = share.get_saved_id(userId, input.getId(), Integer.parseInt(input.getData()));
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
	
	@GetMapping(value = "sharedHistory",produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody List<File_Edit> shared_History(HttpSession session) // displays the log history of shared documents
	{
		Integer id = (Integer) session.getAttribute("ActiveUserID");
		List<File_Edit> list = log.getMyShareLogs(id);
		for(int i=0;i<list.size();i++)
		{
			Integer uid = Integer.parseInt(list.get(i).getEdited_file());
			list.get(i).setEdited_file(user.getByID(uid).getName() + "(" + uid + ")");
		}
		return list;
	}
	
	@PostMapping(value="shareToGroup", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody String shareToGroup(@RequestBody List<String> mail_list, HttpSession session)// shares document to list of users
	{
		Integer userID = (Integer) session.getAttribute("ActiveUserID");
		if(share.get_saved_id(userID, Integer.parseInt(mail_list.get(0)), 0) > 0)
			return "Document accessible to all public. So, it is already accessible to given users also.";
		boolean ok = true;
		for(int i=1;i<mail_list.size();i++)
		{
			Integer toshare = user.ID_of_EMAIL(mail_list.get(i));
			if(toshare>0) // user exist
			{
				Integer j = share.get_saved_id(userID, Integer.parseInt(mail_list.get(0)), toshare);
				if(j==0) // no entry in table shared, so adding entry
				{
					Shared s = new Shared(userID, Integer.parseInt(mail_list.get(0)), toshare);
					share.save(s);
					File_Edit fe = new File_Edit(java.time.LocalDate.now(),java.time.LocalTime.now(), userID,
							Integer.parseInt(mail_list.get(0)), toshare.toString(), "s");
					log.save(fe);
				}
			}
			else
				ok = false;
		}
		if(ok)
			return "Shared the document to all the mentioned users.";
		else
			return "Document shared to all availabe users from list of given users.";
	}
	
	@GetMapping(value="showSHAREDdocument", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody List<Document> showSHAREDdoc(HttpSession session) // returns the list of all document of other users shared
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
				String owner = d.getUser().getName() + "(" + d.getUser().getUserID().toString() + ")";
				docs.add(new Document(d.getID(), d.getLocation() + d.getTitle(), owner));
			}
			return docs;
		}
		catch(Exception e)
		{
			return null;
		}
    }
	
	@PostMapping(value="/update", produces = "application/xml")
	public @ResponseBody String updateFile( @RequestParam("file") MultipartFile file,
			@RequestParam("id") String docID, HttpSession session) // update file in server
	{
		try
		{
			Document d = doc.getByID(Integer.parseInt(docID));
			Integer user_ID = Integer.parseInt(session.getAttribute("ActiveUserID").toString());
			String oldfile = d.getLocation() + java.time.LocalDate.now().toString() + d.getTitle();
			File existing = new File(d.getLocation()+d.getTitle());
			File rename = new File(oldfile);
			if(existing.renameTo(rename))
				file.transferTo(new File(d.getLocation()+d.getTitle()));
	   		File_Edit fe = new File_Edit(java.time.LocalDate.now(),java.time.LocalTime.now(),user_ID,d.getID(), oldfile, "e");
			log.save(fe);
			return "File updated successfully";
		}
		catch(Exception e){ return e.getMessage(); }
	}
	
	@PostMapping(value="updateUser", produces = "application/xml")
	public String updateUser(@RequestParam("email") String newEmail, @RequestParam("name") String newName,
		@RequestParam("CP") String CP, @RequestParam("NP") String newPassword, HttpSession session) // changes the user information in database
	{
		boolean change_psw = false;
		if(CP.compareTo("")==0)//if(CP=="")
			return "Enter password to proceed.";
		if(newPassword.compareTo("")!=0)//if(newPassword != "")
			change_psw = true;
		String current = DigestUtils.md5DigestAsHex(CP.getBytes());
		
		User cu = user.getByID(Integer.parseInt(session.getAttribute("ActiveUserID").toString()));
		if(cu.getPassword().equalsIgnoreCase(current))
		{
			if(newEmail.compareTo("")!=0)//if(newEmail != "")
				cu.setEmail(newEmail);
			if(newName.compareTo("")!=0)//if(newName != "")
				cu.setName(newName);
			if(change_psw)
				cu.setPassword(DigestUtils.md5DigestAsHex(newPassword.getBytes()));
			user.update(cu);
			return "Data Updated!!!";
		}
		else
			return "ERROR !!! Values Cannot be Updated";
	}
	
	@PostMapping(value = "uploadFile", produces = {MediaType.APPLICATION_XML_VALUE})
	public @ResponseBody String uploadFile(@RequestParam("file") MultipartFile file,
			@RequestParam("category") String category,@RequestParam("folder") String folder,
			@RequestParam("NF") String NF,@RequestParam("DES") String DES,@RequestParam("date") String dateI,
			HttpSession session) // upload file in server
	{
		try
	    {
			Integer userID = (Integer) session.getAttribute("ActiveUserID");
			User u = user.getByID(userID);
			String fileName = file.getOriginalFilename();
			String full_path = root_path + userID + "/";
			if(folder.compareTo("root")!=0)
			{
				full_path = full_path + folder + "/";
			}
			if(NF.compareToIgnoreCase("")!=0)
			{
				full_path = full_path + NF + "/";
				File create_folder = new File(full_path);
				if(!create_folder.mkdir())
					return "The mentioned new folder could not be created.So, file not uploaded to server.";
			}
    		File fc = new File(full_path + fileName);
    		if(fc.exists())
    			return "File with same name exist in same location.";
    		file.transferTo(fc);
    		Document d = new Document();
    		if(dateI.compareTo("")!=0)
    			d.setDate(Date.valueOf(dateI)); //LocalDate.parse(dateI)
    		d.setUser(u);
    		d.setTitle(fileName);
    		d.setLocation(full_path);		
    		if(DES.compareToIgnoreCase("")!=0)
    			d.setDescription(DES);
    		doc.save(d);
    		File_Edit f = new File_Edit(java.time.LocalDate.now(),java.time.LocalTime.now(), u.getUserID(), d.getID(), "u");
    		log.save(f);
    		Category c = cs.getByID(Integer.parseInt(category));
    		if(Integer.parseInt(category)==0)
    			return "File Successfully uploaded to server. ";
    		else if(c==null)
    		{
    			return "Cannot saved in mentioned category. File saved without giving any category.";
    		}
    		Document_Category DC = new Document_Category(d, c);
    		dc.save(DC);
    	    return "File Successfully uploaded to server. ";
	    } 
	    catch (Exception e) 
	    {
	    	return "ERROR OCCURED. Reason => " + e.getMessage();
	    }
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
