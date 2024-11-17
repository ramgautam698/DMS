package com.example.demo.serviceImp;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.File_EditDao;
import com.example.demo.model.File_Edit;
import com.example.demo.service.File_EditService;

@Service
public class File_EditSImp implements File_EditService
{
	@Autowired
	private File_EditDao fileinfo;

	@Override
	public File_Edit getByID(Integer DocumentID)
	{
		return fileinfo.findByID(DocumentID);
	}

	@Override
	public void save(File_Edit F)
	{
		fileinfo.save(F);
	}
	
	public List<File_Edit> getALL() // gets all the data from table File_Edit
	{
		return fileinfo.findAll();
	}
	
	public List<File_Edit> getMyShareLogs(Integer userID) // gets all file share and unshare logs of userID
	{
		return fileinfo.allShareLogOFUser(userID);
	}
	
//	public List<File_Edit> getLogsofOTHER(String userID) // logs of document share/unshare that is accessible to userID:unused
//	{
//		List<File_Edit> all = fileinfo.findAll();
//		List<File_Edit> required = new ArrayList<File_Edit>();
//		for(int i=0;i<all.size();i++)
//		{
//			try
//			{
//				if(all.get(i).getEdited_file().contentEquals(userID))
//				{
//					required.add(all.get(i));
//				}
//			}
//			catch(Exception e)
//			{}
//		}
//		return required;
//	}
	
	public List<File_Edit> getLogOf(List<Integer> doc_list, Integer userID_) // log of history of others document that userID have access to
	{
		List<File_Edit> required = new ArrayList<File_Edit>();
		for(int i=0;i<doc_list.size();i++)
		{
			List<File_Edit> f = fileinfo.log_doc(doc_list.get(i));
			for(int j=0;j<f.size();j++)
			{
				if(f.get(j).getUser_ID() == userID_)
					f.remove(i);
			}
			required.addAll(f);
		}
		return required;
//		List<File_Edit> all = fileinfo.findAll();
//		List<File_Edit> required = new ArrayList<File_Edit>();
//		String userID = userID_.toString();
//		LocalDate date = LocalDate.of(2022, 1, 1); // year month day
//		LocalTime time = LocalTime.of(0, 0);
//		for(int i=0;i<all.size();i++)
//		{
//			for(int j=0;j<doc_list.size();j++)
//			{
//				try
//				{
//					if((all.get(i).getDoc_ID()==doc_list.get(j)))// && all.get(i).getEdited_file().contentEquals(userID))
//					{
//						if(all.get(i).getAction().contentEquals("s")) // rows of share information
//						{
//							if(all.get(i).getDate().compareTo(date)>0 && all.get(i).getTime().compareTo(time)>0)
//							{
//								if(all.get(i).getEdited_file().contentEquals(userID))
//								{
//									date = all.get(i).getDate();
//									time = all.get(i).getTime();
//								}
//								required.add(all.get(i));
//							}
//						}
//						if(all.get(i).getAction().contentEquals("x")) // rows of unshared information
//						{
//							if(all.get(i).getDate().compareTo(date)>0 && all.get(i).getTime().compareTo(time)>0)
//							{
//								required.add(all.get(i));
//							}
//						}
//					}
//				}
//				catch(Exception e)
//				{}
//			}
//		}
//		return required;
	}
}
