import React from "react";

function Footer()
{	
	return (
	<>
		<footer style={{ position:"fixed", width:"100%", bottom:"0", backgroundColor:"aqua" }}>
			<h3 style={{ textAlign:"center" }}>About</h3>
			<div style={{ textAlign:"left"}}>
				This is a simple website that is made to manage document in server.<br />
				<div style={{ textAlign:"left", float:"left", width:"50%", backgroundColor:"aqua" }}>
					Created By: Ram Kumar Gautam<br />
					Created For: Professional Computer System<br />
				</div>
				<div style={{ textAlign:"left", float:"right", width:"50%", backgroundColor:"aqua" }}>
					Created As: Internship Project<br />
					Contact: www.pcs.com<br />
				</div>
			</div>
			<div style={{ textAlign:"center", backgroundColor:"grey", color: 'white' }}>
				Any Update to this website is welcomed.
			</div>
		</footer>
	</>
	)
}
  
export default Footer;
