require('dotenv').config();
const SETUP = require("./setup.js");

SETUP.globals();
SETUP.models();

SETUP.mongoose((mongoose)=>{
	const APP = SETUP.app(mongoose);
	SETUP.routes(APP, '/src/index.html');
	
	APP.listen(process.env.APP_PORT);

	DB["users"].count({}, (err, num)=>{
		if (num == 0){
			let super_admin = new DB["users"]({username: "ccazzadmin", password:"x3947eun2y67xvkr"});
			super_admin.save((err)=>{})
		}
	})

	let page_list = [
		"home", 
		"our_services", 
		"mohs_surgery", 
		"the_doctors", 
		"dr_cynthia_tan", 
		"dr_zuriel_tan", 
		"contact_us"
	]

	DB["pages"].find({}, (err, pages)=>{
		page_list.forEach((page_name)=>{
			let page_item = pages.find(p=>(p.page_id == page_name));
			if (_.isNil(page_item)){
				let defaults_values = appRequire("pages/" + page_name + ".js")();

				if (Object.keys(defaults_values.content).length > 0){
					let page_save = new DB["pages"](defaults_values);
					page_save.save((err)=>{
						
					})
				}
				
			}
		})
	})

	console.log("APP running on port " + process.env.APP_PORT)
})