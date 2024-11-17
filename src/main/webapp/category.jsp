<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Category Form</title>

<script src="${pageContext.request.contextPath}/resources/functions.js">

<script  src="https://code.jquery.com/jquery-1.7.1.min.js"></script>

<!-- JS, Popper.js, and jQuery -->
<script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.min.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" crossorigin="anonymous"></script>

<!-- CSS only -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
<style>
.center { text-align: center; border: 3px solid green; }
</style>
</head>
<body>

<center>
		<h1>Document Management System</h1>
		<h5>Create Category Form</h5>
</center>

<a href="userpage">Go To Home Page</a><br>${msg}<br>

<div>
	<form action="categoryCreate" method="POST">
		<div class="form-group">
			<label class="col-sm-2 col-form-label">Value(Maximum 20 character)</label>
			<div class="col-sm-10">
				<input type="text" class="form-control-plaintext" id="value" name="value" placeholder="New Category" required>
			</div>
		</div>
		<div class="form-group">
			<label class="col-sm-2 col-form-label">Description(Maximum 100 character)</label>
			<div class="col-sm-10">
				<input type="text" class="form-control-plaintext" id="desc" name="desc" placeholder="Description" required>
			</div>
		</div>
		<div class="form-group form-check">
				<input class="form-check-input" type="checkbox" id="active" name="active">
				<label class="form-check-label" for="flexCheckDefault">Make this available for choosing category.</label>
		</div>
		<div class="form-group">
			<input type="submit" value="Create Category">
		</div>
	</form>
</div>
<p><button type="button" class="btn btn-primary" onclick="categoryView()">View all Categories information</button></p>
<div>
	<table class="table table-hover" id="categorytable"></table>
	<p><button type="button" id="Cupdate" onclick="categoryUpdate()">Update Category</button></p>
</div>
<div id="hidden" style="display:none" class="center">
		<p id="msgg"></p>Update Values of category:<br>
		ID of category: <input type="number" id="num"><br>
		Name: <input type="text" id="name"><br>
		Description: <input type="text" id="DESC"><br>
		<label for="myCheck">Make this category available in drop box while searching and adding document: </label> 
		<input type="checkbox" id="myCheck" ><br>
		<button type="button" onclick="categoryUpdate()" class="btn btn-primary">Update</button><br>
</div>

</body>
</html>