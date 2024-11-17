package com.example.demo.model;

public class Content
{
	private Integer id;
	private String data;
	
	public Content(Integer id, String data)
	{
		this.id = id;
		this.data = data;
	}
	
	public Content()
	{ }
	
	public Content(String data)
	{
		this.data = data;
	}
	
	@Override
	public String toString()
	{
		return "ID = " + this.id.toString() + ", Data = " + this.data;
	}
	
	public Integer getId() 
	{
		return id;
	}
	public void setId(Integer id) 
	{
		this.id = id;
	}
	public String getData() 
	{
		return data;
	}
	public void setData(String data) 
	{
		this.data = data;
	}
	
}
