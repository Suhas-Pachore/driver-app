
var fs = require('fs');
var async = require('async');
var loopback = require('loopback');
var dir = __dirname + './../../common/data/';

module.exports = function() {
	for(var i=0;i<process.argv.length;i++){
		if(process.argv[i] === '-u'){
			loadData();
		}
	}	
};


function loadData(){
	var tempFileNames = fs.readFileSync(dir + 'meta.json');
	var fileNames = JSON.parse(tempFileNames);
	async.each(fileNames, function(entry, callback){
		var model = loopback.findModel(entry.model);
		if(!model){
			console.log("Model not defined");
			callback();
			return;
		}
		var data = fs.readFileSync(dir + entry.filename);
		data = JSON.parse(data);
		for(var i=0;i<data.length;i++){
			model.create(data[i], function(){
				console.log("data inserted");
			});
		}
	});
}