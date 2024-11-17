package com.example.demo.serviceImp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.SharedDao;
import com.example.demo.model.Shared;
import com.example.demo.service.SharedService;

@Service
public class SharedServiceImp implements SharedService
{
	@Autowired
	private SharedDao share;
	
	@Override
	public Shared getByID(Integer ID)
	{
		return share.getById(ID);
	}

	@Override
	public void save(Shared s) 
	{
		share.save(s);
	}

	@Override
	public void delete(Shared s) 
	{
		share.delete(s);
	}
	
	public List<Integer> getDoc_ids(Integer UserID) // returns document id, that is accessible by UserId but belongs to other
	{
		return share.get_friends_docIDs(UserID);
	}
	
	public List<Integer> my_shared_doc(Integer UserID) // returns document id that belongs to UserId but is shared
	{
		return share.myShared_docIDs(UserID);
	}
	
	public String acc_doc(Integer DocumentID) // returns list of UserID that have access to DocumentID
	{
		List<Integer> ids = share.friends_IDs(DocumentID);
		String to_return = "";
		for(int i=0;i<ids.size();i++)
		{
			to_return = to_return + ids.get(i) + ", ";
		}
		return to_return;
	}
	
	public List<Integer> acc_doc_list(Integer DocumentID) // returns list of UserID that have access to DocumentID
	{
		return share.friends_IDs(DocumentID);
	}
	
	public Integer get_saved_id(Integer ownerId, Integer Doc_ID, Integer unshareID)
	// id of shared table row when file is being shared and also when unshared
	{
		Integer id = share.rowID(Doc_ID, ownerId, unshareID);
		if(id==null)
			return 0; // no entry with given parameter found
		return id;
	}
	
	public Integer get_saved_id(Integer ownerId, Integer Doc_ID) // id of share table row when file is deleted.
//	used in UserController.java line 195
	{
		List<Shared> all =  share.findAll();
		for(int i=0;i<all.size();i++)
		{
			if(all.get(i).getDoc_ID() == Doc_ID)
			{
				if(all.get(i).getOwnerID() == ownerId)
				{
					return all.get(i).getID();
				}
			}
		}
		return 0;
	}
	
	public void deleteByID(Integer SharedID) // delete the row of table 'shared' when file is unshared or deleted
	{
		share.deleteById(SharedID);
	}
	
	public void deleteALLshares(Integer docID, Integer userID) // deletes row where doc_id = docID and ownerID = userID
	{
		List<Integer> allShares = share.rowID_OD(docID, userID);
		for(int i=0;i<allShares.size();i++)
		{
			share.deleteById(allShares.get(i));
		}
	}
	
	public List<Integer> friendsID(Integer myid) // id of all users with whom document is shared by user with id = myid
	{
		List<Integer> friends = share.who_shares_by_doc(myid);
		friends.remove(0);
		return friends;
	}
	
	public List<Integer> friendID_received(Integer myid) // id of all users with who share document with user with id = myid
	{
		return share.who_shares_doc_with_me(myid);
	}
}
