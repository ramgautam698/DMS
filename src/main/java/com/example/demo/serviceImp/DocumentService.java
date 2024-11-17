package com.example.demo.serviceImp;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.DocumentDao;
import com.example.demo.dao.UserDao;
import com.example.demo.model.Document;
import com.example.demo.model.User;

@Service
public class DocumentService implements com.example.demo.service.DocumentService
{
	@Autowired
	private DocumentDao doc;
	
	@Autowired
	private UserDao UserDAO;

	@Override
	public Document getByID(Integer DocumentID) 
	{
		return doc.getById(DocumentID);
	}
	
	@Override
	public void save(Document D)
	{
		//User user = userDao.findByUserID(phone.getUser().getUserID());
		User user = UserDAO.findByUserID(D.getUser().getUserID());
		user.add(D);
		doc.save(D);
	}
	
	public void delete(Integer documentID)
	{
		doc.deleteById(documentID);
	}
	
	public void update(Document D)
	{
		Document d = doc.findByID(D.getID());
		if(D.getTitle()!=null)
			d.setTitle(D.getTitle());
		doc.save(d);
	}
	
	public boolean checkDoc(Integer id)
	{
		return doc.existsById(id);
	}
	
	public List<Integer> files_of_location(String location, Integer userid) // Accessible files of location
	// document deleted cannot be accessed by user, also old files updated also cannot be accessed
	{
		List<Document> l = UserDAO.getById(userid).getDocumentList();
		List<Integer> fileids = new ArrayList<Integer>();
		for(int i=0;i<l.size();i++)
		{
			if(l.get(i).getLocation().compareToIgnoreCase(location)==0)
				fileids.add(l.get(i).getID());
		}
		return fileids;
	}
	
	public List<Integer> files_in_folder(String folder, Integer userid) // all files in tree of folder
	{
		List<Document> l = UserDAO.getById(userid).getDocumentList();
		List<Integer> ids = new ArrayList<Integer>();
		for(int i=0;i<l.size();i++)
		{
			if(l.get(i).getLocation().contains(folder))
			{
				ids.add(l.get(i).getID());
			}
		}
		return ids;
	}
}
