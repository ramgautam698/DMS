package com.example.demo.service;

import com.example.demo.model.File_Edit;

public interface File_EditService
{
	public File_Edit getByID(Integer DocumentID);
	public void save(File_Edit file_edit);
}
