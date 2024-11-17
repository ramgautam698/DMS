package com.example.demo.serviceImp;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.Document_CategoryDao;
import com.example.demo.model.Category;
import com.example.demo.model.Document;
import com.example.demo.model.Document_Category;
import com.example.demo.service.Document_CategoryService;

@Service
public class Document_CategorySImp implements Document_CategoryService
{
	@Autowired
	private Document_CategoryDao dc;
	
	@Override
	public Document_Category findByID(Integer id)
	{
		return dc.findByID(id);
	}

	@Override
	public void save(Document_Category obj)
	{
		dc.save(obj);
	}

	@Override
	public void delete(Integer id)
	{
		Document_Category a = dc.findByID(id);
		if(a==null)
			return;
		dc.delete(a);
	}
	
	public List<Document_Category> ALL(Document d) // return all category to which document d belongs
	{
		return dc.category_IDs(d.getID());
//		List<Document_Category> all =  dc.findAll();
//		List<Document_Category> Final = new ArrayList<Document_Category>();
//		for(int i=0;i<all.size();i++)
//		{
//			if(all.get(i).getDoc()==d)
//				Final.add(all.get(i));
//		}
//		return Final;
	}
	
	public List<String> allCategoryName(Document d) // return names of all category of document d
	{
		List<String> l = new ArrayList<String>();
		List<Document_Category> all = ALL(d);
		for(int i=0;i<all.size();i++)
		{
			l.add(all.get(i).getCategory().getName());
		}
		return l;
	}
	
	public String allCategory(Document d) // return names of all category of document d in string form
	{
		List<String> l = allCategoryName(d);
		String s = "";
		for(int i=0;i<l.size();i++)
		{
			s = s + l.get(i) + ",";
		}
		return s;
	}
	
	public List<Category> doc_Category(Document d) // return all category of document d
	{
		List<Document_Category> all = ALL(d);
		List<Category> data = new ArrayList<Category>();
		for(int i=0;i<all.size();i++)
		{
			if(all.get(i).getDoc().equals(d))
			{
				data.add(all.get(i).getCategory());
			}
		}
		return data;
	}
	
	public boolean check(Document_Category obj) // check if the Document-Category Map Exist, return true if exist
	{
		Integer doc_id = obj.getDoc().getID();
		Integer category_id = obj.getCategory().getID();
		List<Document_Category> all = dc.document_category_MAP(doc_id, category_id);
		if(all.size()>0)
			return true;
		else
			return false;
	}
	
	public void delete_Category(Category c) // delete all entries of category c, from document_category table
	{
		List<Document_Category> list = dc.findByCategory(c);
		for(int i=0;i<list.size();i++)
		{
			dc.delete(list.get(i));
		}
	}
}
