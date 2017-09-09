function Metal(type){
		this.type = type;
		this.total = 0.0;
		this.weighers = [];
}

Metal.prototype.average = function(){
		var x;
		if(this.weighers.length > 0)
			return (this.total/this.weighers.length).toFixed(2);
		else
			return 0;
}

Metal.prototype.add_rate = function(rate){
		if(typeof(rate) === "number")
			this.total = this.total + rate;
}

Metal.prototype.add_weigher = function(weigher_code){
		if(typeof weigher_code === "string" && /^[a-zA-z]$/.test(weigher_code) && !this.weighers.includes(weigher_code))
			this.weighers.push(weigher_code);
}
		

Metal.prototype.weighers_string = function(){
		if(this.weighers.length === 0)
				return "None";
		var re = "";
		for(var j=0; j<this.weighers.length;j++){
				re = re + ` Weigher ${this.weighers[j]},`;
		}
		return re.slice(0,-1);
}

function generate(){
		presets = create_presets(pre);
		parse_data(weigher_data, presets);
		console.log(presets);
		populate_table(presets);

}

function create_presets(pre_list){
		var presets = {};
		var preset_regex = /PRESET\s(\d+)\s-\s([a-zA-z]+)/;
		for(var i = 0; i < pre_list.length; i++){
				pre_str = pre_list[i];
				results = preset_regex.exec(pre_str);
				presets[results[1]] = new Metal(results[2]);
		}
		return presets;
}

function parse_data(data_obj, presets){
		var data_regex = /STATISTICAL_WEIGHER_([A-Z])_PRESET_(\d+)_KG_PER_HOUR/;
		var results, weigher_code, preset_code, current_rate, current_metal;
		for(var prop in data_obj){
				results = data_regex.exec(String(prop));
				weigher_code = results[1];
				preset_code = results[2];
				current_rate = data_obj[prop];

				if(preset_code in presets){
						current_metal = presets[preset_code];
						current_metal.add_weigher(weigher_code);
						current_metal.add_rate(current_rate);
				}
	   	}
}


function populate_table(presets){
		var table = document.getElementById("data_table");
		var current_metal, current_row, current_data;
		for(var prop in presets){
				current_metal = presets[prop];
				console.log(current_metal);
				current_data = document.createElement("td");
				current_data.innerHTML = `Preset : ${current_metal.type} <br>Weighers : ${current_metal.weighers_string()} <br>Total KG Per Hour: ${current_metal.average()}`;
				current_row = document.createElement("tr");
				current_row.appendChild(current_data);
				table.appendChild(current_row);
		}
}
				


