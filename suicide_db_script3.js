//Actual SVG dimensions: 800 x 500
//Omitting margins in w & h assignment is useful for creating scales

var m = {left: 50, right: 50, top: 50, bottom: 50};
var w = 800 - m.left - m.right;
var h = 500 - m.top - m.bottom;

//Create scales
//xScale is for each age group
var xScale = d3.scale.ordinal()
			//0.2 padding
			.rangeRoundBands([0, w], .2);

//bScale is scale for each gender bar
var bScale = d3.scale.ordinal();

//yScale is scale for rate
var yScale = d3.scale.linear()
			.range([h, 0]);

//Scale for colors
var color = d3.scale.ordinal()
				.range(["#b075ad", "#7ca5cc"]);

//Create x axis 
var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient('bottom'); 

var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient('left')
				.tickFormat(d3.format('.2'));

//Create svg area
//svg area is 800 x 500 
//g is nested inside svg
var svg = d3.select('body')
			.append('svg')
			.attr('width', w + m.left + m.right)
			.attr('height', h + m.top + m.bottom);
svg.append('g');

//Read data in 
//This dataset has one Object for each age group/year combination
var dataset = [{"AgeGrp":"10 to 14","Female":0.5,"Male":1.9,"Year":"1999","c_Female":200,"c_Male":36.8421,"d_Female":1,"d_Male":0.7,"Female_Start":1.5,"Male_Start":2.6,"c_Female_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Icon":"↑","c_Male_Color":"#A62A2A"},{"AgeGrp":"10 to 14","Female":1.5,"Male":2.6,"Year":"2014","c_Female":200,"c_Male":36.8421,"d_Female":1,"d_Male":0.7,"Female_Start":1.5,"Male_Start":2.6,"c_Female_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Icon":"↑","c_Male_Color":"#A62A2A"},{"AgeGrp":"15 to 24","Female":3,"Male":16.8,"Year":"1999","c_Female":53.3333,"c_Male":8.3333,"d_Female":1.6,"d_Male":1.4,"Female_Start":4.6,"Male_Start":18.2,"c_Female_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Icon":"↑","c_Male_Color":"#A62A2A"},{"AgeGrp":"15 to 24","Female":4.6,"Male":18.2,"Year":"2014","c_Female":53.3333,"c_Male":8.3333,"d_Female":1.6,"d_Male":1.4,"Female_Start":4.6,"Male_Start":18.2,"c_Female_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Icon":"↑","c_Male_Color":"#A62A2A"},{"AgeGrp":"25 to 44","Female":5.5,"Male":21.6,"Year":"1999","c_Female":30.9091,"c_Male":12.5,"d_Female":1.7,"d_Male":2.7,"Female_Start":7.2,"Male_Start":24.3,"c_Female_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Icon":"↑","c_Male_Color":"#A62A2A"},{"AgeGrp":"25 to 44","Female":7.2,"Male":24.3,"Year":"2014","c_Female":30.9091,"c_Male":12.5,"d_Female":1.7,"d_Male":2.7,"Female_Start":7.2,"Male_Start":24.3,"c_Female_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Icon":"↑","c_Male_Color":"#A62A2A"},{"AgeGrp":"45 to 64","Female":6,"Male":20.8,"Year":"1999","c_Female":63.3333,"c_Male":42.7885,"d_Female":3.8,"d_Male":8.9,"Female_Start":9.8,"Male_Start":29.7,"c_Female_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Icon":"↑","c_Male_Color":"#A62A2A"},{"AgeGrp":"45 to 64","Female":9.8,"Male":29.7,"Year":"2014","c_Female":63.3333,"c_Male":42.7885,"d_Female":3.8,"d_Male":8.9,"Female_Start":9.8,"Male_Start":29.7,"c_Female_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Icon":"↑","c_Male_Color":"#A62A2A"},{"AgeGrp":"65 to 74","Female":4.1,"Male":24.7,"Year":"1999","c_Female":43.9024,"c_Male":7.6923,"d_Female":1.8,"d_Male":1.9,"Female_Start":5.9,"Male_Start":26.6,"c_Female_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Icon":"↑","c_Male_Color":"#A62A2A"},{"AgeGrp":"65 to 74","Female":5.9,"Male":26.6,"Year":"2014","c_Female":43.9024,"c_Male":7.6923,"d_Female":1.8,"d_Male":1.9,"Female_Start":5.9,"Male_Start":26.6,"c_Female_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Icon":"↑","c_Male_Color":"#A62A2A"},{"AgeGrp":"75 and over","Female":4.5,"Male":42.4,"Year":"1999","c_Female":-11.1111,"c_Male":-8.4906,"d_Female":-0.5,"d_Male":-3.6,"Female_Start":4.5,"Male_Start":42.4,"c_Female_Icon":"↓","c_Female_Color":"#608341","c_Male_Icon":"↓","c_Male_Color":"#608341"},{"AgeGrp":"75 and over","Female":4,"Male":38.8,"Year":"2014","c_Female":-11.1111,"c_Male":-8.4906,"d_Female":-0.5,"d_Male":-3.6,"Female_Start":4.5,"Male_Start":42.4,"c_Female_Icon":"↓","c_Female_Color":"#608341","c_Male_Icon":"↓","c_Male_Color":"#608341"}];

var agesDups = dataset.map(function(d) {
				return d.AgeGrp;});

//array of ages
var ages = agesDups.filter(function(elem, pos) {
				return agesDups.indexOf(elem) == pos;});

//array of genders
var genders = d3.keys(dataset[0]).filter(function(key) {
				return key == "Female" | key == "Male" ;});

//array of gender_change label
var gender_change = d3.keys(dataset[0]).filter(function(key) {
				return key == "c_Female" | key == "c_Male";});

//array of icon_change label
var icon_change = d3.keys(dataset[0]).filter(function(key) {
				return key == "c_Female_Icon" | key == "c_Male_Icon";});

//array of color_change label
var color_change = d3.keys(dataset[0]).filter(function(key) {
				return key == "c_Female_Color" | key == "c_Male_Color";});

//array of gender_diff label
var gender_diff = d3.keys(dataset[0]).filter(function(key) {
				return key == "d_Female" | key == "d_Male";});
//array of start labels
var gender_start = d3.keys(dataset[0]).filter(function(key) {
				return key == "Female_Start" | key == "Male_Start";});

//Add gendat, gendat_labs, tip_labs, tip_icons, and tip_col into each Object
dataset.forEach(function(d) {
	//returns gender and suicide rate
	d.gendat = genders.map(function(series) {
		return { gender: series, value: +d[series] };
	});
	//returns gender and suicide rate labels
	d.gendat_labs = genders.map(function(series) {
		return { gender: series, value: d3.format('.1f')(+d[series]) };
	});
	//returns gender_change and value of change
	d.tip_labs = gender_change.map(function(series) {
		return { change: series, value: Math.abs(+d3.format('.1f')(+d[series])) };
	});
	//returns gender_diff and value of difference
	d.hgh_labs = gender_diff.map(function(series) {
		return { diff: series, value: Math.abs(+d3.format('.1f')(+d[series]))};
	});
	//returns gender_start and value for start value
	d.gen_start = gender_start.map(function(series) {
		return { start: series, value: +d[series] };
	});
	//returns icon_change and arrow
	d.tip_icons = icon_change.map(function(series) {
		return { icon: series, value: d[series] };
	});
	//returns color_change and color
	d.tip_col = color_change.map(function(series) {
		return { color: series, value: d[series] };
	});
});

//Add change, icon, and color into each gender
//Program has to be able to pull FEMALE and MALE data out for graph
dataset.forEach(function(d) {
	for (i = 0; i < 2; i++) {
		d.gendat[i].change = d.tip_labs[i].value;
		d.gendat[i].icon = d.tip_icons[i].value;
		d.gendat[i].col = d.tip_col[i].value;
		d.gendat[i].base = d.gen_start[i].value;
		d.gendat[i].difference = d.hgh_labs[i].value;
	};
})

//Start with 1999 data on init
var dat = dataset.filter(function(d) {
	return d.Year == "1999"; 
});

//Finish defining scales now that you have data
xScale.domain(ages);

bScale.domain(genders)
	.rangeRoundBands([0, xScale.rangeBand()]);

//yScale should be 0 to max suicide rate
//within each year, go into each object
//within each object, go into gendat
//within each gendat, return the rate and pick the max rate
//within each object, pick the max rate of male and female
yScale.domain([0, d3.max(dat, function(d) {
	return d3.max(d.gendat, function(d) {
		return d.value;});})]);

//Create bars

//Prepare male/female data within each age group
var data_use = svg.selectAll(".ages")
				.data(dat)
				//enter dat into svg
				.enter()
				.append('g')
				.attr('class', 'ages')
				.attr('transform', function(d) {
					//xScale("10 to 14") = 25, xScale("15 to 24") = 137
					return 'translate(' + xScale(d.AgeGrp) + ', 0)'; });
var bars = data_use.selectAll('rect')
	//go into data_use and pull out gendat
	.data(function(d) {
		return d.gendat;
	})
	.enter()
	//append a rectangle to each gendat (male, female)
	.append('rect')
	//width of each rectangle is 45
	.attr('width', bScale.rangeBand())
	//bScale("Female") = 0, bScale("Male") = 45
	//Female would be (0, converted y); Male ewould be (45, converted y)
	.attr('x', function(d) { return bScale(d.gender); })
	.attr('y', function(d) { return yScale(d.value); })
	.attr('height', function(d) { return h - yScale(d.value); })	
	//Still have to add padding to left and bottom for placement
	.attr('transform', 'translate(' + m.left + ', ' + m.bottom + ')')
	.attr('opacity', '1')
	.style('fill', function(d) { return color(d.gender) });

// //Add highlight bars, but hide
var hlt_use = svg.selectAll(".ages2")
				.data(dat)
				//enter dat into svg
				.enter()
				.append('g')
				.attr('class', 'ages2')
				.attr('transform', function(d) {
					//xScale("10 to 14") = 25, xScale("15 to 24") = 137
					return 'translate(' + xScale(d.AgeGrp) + ', 0)'; });
var hlt_bars = hlt_use.selectAll('rect')
				//go into hlt_use and pull out gendat
				.data(function(d) {
					return d.gendat;
				})
				.enter()
				//append a rectangle to each gendat (male, female)
				.append('rect')
				//width of each rectangle is 45
				.attr('class', 'hlght')
				.attr('width', bScale.rangeBand())
				//bScale("Female") = 0, bScale("Male") = 45
				//Female would be (0, converted y); Male ewould be (45, converted y)
				.attr('x', function(d) { return bScale(d.gender); })
				.attr('y', function(d) { return yScale(d.base); })
				.attr('height', function(d) { return h - yScale(d.difference); })	
				//Still have to add padding to left and bottom for placement
				.attr('transform', 'translate(' + m.left + ', ' + m.bottom + ')')
				.attr('opacity', '0')
				.style('fill', function(d) { return d.col});

// var tip = d3.tip()
// 	.attr('class', 'tool-tip')
// 	.offset([20 ,0])
// 	.html(function(d) {
// 		return d.change + '%';
// 	});

// svg.call(tip);

// bars.on('mouseover', tip.show)
// 	.on('mouseout', tip.hide);
	
//Add data labels

//Need gendat_labs bc of character type
var lbl = data_use.selectAll('text')
	.data(function(d) {
		return d.gendat_labs;
	})
	//grab gendat_labs
	.enter()
	.append('text');
lbl.text(function(d) {
	//add value inside each gendat_labs
	return d.value;
	})
	.attr('text-anchor', 'middle')
	.attr('x', function(d) { return bScale(d.gender) + 20 })
	.attr('y', function(d) { return yScale(d.value) - 5 })
	.attr('transform', 'translate(' + m.left + ',' + m.bottom + ')')
	.attr('opacity', 1);

//Add change labels, but hide

//Load up 2014 data for 2014 positioning
var dat2 = dataset.filter(function(d) {
	return d.Year == "2014"; 
});
var dat_lbls = svg.selectAll(".ages3")
				.data(dat2)
				//enter dat2 into svg
				.enter()
				.append('g')
				.attr('class', 'ages3')
				.attr('transform', function(d) {
					//xScale("10 to 14") = 25, xScale("15 to 24") = 137
					return 'translate(' + xScale(d.AgeGrp) + ', 0)'; });
var change_lbl = dat_lbls.selectAll('.change')
		.data(function(d) {
			return d.gendat;
		})
		.enter()
		.append('text')
		.attr('class', 'change');

	change_lbl.text(function(d) {
		//NOTE: In order for this to work, icon, col, and change
		//have to be inside same object
		return d.icon + d.change + '%';
	})
		.attr('text-anchor', 'middle')
		.attr('fill', function(d) { 
			return d.col; })
		.attr('x', function(d) { return bScale(d.gender) + 20 })
		.attr('y', function(d) { return yScale(d.value) - 10 })
		.attr('transform', 'translate(' + m.left + ',' + m.bottom + ')')
		.attr('opacity', '0');

//Finish creating axes
svg.append('g')
	.attr('class', 'xaxis')
	//Still have to add padding to left and bottom for placement
	.attr('transform', 'translate(' + m.left + ', ' + (h + m.bottom) + ')')
	.call(xAxis)
	.selectAll('text')
	.attr('y', '13px');
svg.append('g')
	.attr('class', 'yaxis')
	//Still have to add padding to left and top for placement
	.attr('transform', 'translate(' + m.left + ', ' + m.top + ')')
	.call(yAxis);
//Add axis labels
svg.append('text')
	.attr('text-anchor', 'middle')
	.attr('transform', 'translate(' + (m.left/3) + ', ' + (h + m.top + m.bottom)/2 + ')rotate(-90)')
	.text('Deaths per 100,000 population');

//Add title
svg.append('text')
	.attr('class', 'title')
	.attr('text-anchor', 'middle')
	.attr('transform', 'translate(' + (w + m.left + m.right)/2 + ', ' + (m.top/3) + ')')
	.text('Suicide rates in 1999 by gender: United States');

//Add legend
var legend = svg.selectAll('.legend')
	.data(genders.slice())
	.enter()
	.append('g')
	.attr('class', 'legend')
	.attr('transform', function(d, i) {
		return 'translate(0,' + i * 20 + ')';
	});
legend.append('rect')
	.attr('x', m.left + 15)
	.attr('y', m.top + 10)
	.attr('width', 15)
	.attr('height', 15)
	.style('fill', color);
legend.append('text')
	.attr('x', m.left + 35)
	.attr('y', m.top + 23)
	.style('text-anchor', 'left')
	.text(function(d) { return d; });

d3.select('body')
	.append('div')
	.attr('class', 'footer');
d3.select('.footer')
	.append('p')
	.attr('id', 'footnote')
	.html("<strong>NOTES:</strong> For all age groups, the difference in rates between 1999 and 2014 is significant at the 0.05 level. Suicides are identified with codes U03, X60-X84, and Y87.0 from the <em>International Statistical Classification of Diseases and Related Health Problems, Tenth Revision</em>. Access data for Figure 2 at: <a href='http://www.cdc.gov/nchs/data/databriefs/db241_table.pdf#2'>http://www.cdc.gov/nchs/data/databriefs/db241_table.pdf#2</a>. <br/><strong>SOURCE: </strong>NCHS, National Vital Statistics System, Mortality.");

var showChange = function() { 
	var data = dataset.filter(function(d) {
		return d.Year == 1999;
	});

	var data_lbs = dataset.filter(function(d) {
		return d.Year == 2014;
	});

	//Update bars
	svg.selectAll('.ages')
		.data(dat)
		.selectAll('rect')
		.data(function(d) {
			return d.gendat;
		})
		.attr('y', function(d) { return yScale(d.value) })
		.attr('height', function(d) { return h - yScale(d.value); })
		.attr('opacity', '1');

	//Show highlight bars
	svg.selectAll('.ages2')
	.data(dat)
	.selectAll('.hlght')
	.data(function(d) {
		return d.gendat;
	})
	.transition()
	.ease('linear')
	.duration(1000)
	.delay(500)
	.attr('opacity', '0.3');

	//Hide data labels
	svg.selectAll('.ages')
		.data(dat)
		.selectAll('text')
		.attr('opacity', 0);

	//Show change labels
	svg.selectAll('.ages3')
	.data(dat2)
	.selectAll('.change')
	.data(function(d) {
		return d.gendat;
	})
	.transition()
	.ease('linear')
	.duration(1000)
	.delay(500)
	.attr('opacity', '1');

	//Update title
	svg.select('.title')
		.transition()
		.text('Change in suicide rate between 1997 and 2014, by gender: United States');
	};


var updateData = function(sel) {
	
	var new_year = sel.value;
	var dat = dataset.filter(function(d) {
		return d.Year == new_year; 
	});

	// yScale.domain([0, d3.max(dat, function(d) {
	// 	return d3.max(d.yrdat, function(d) {
	// 		return d.value;});})]);

	//Update bars
	svg.selectAll('.ages')
		.data(dat)
		.selectAll('rect')
		.data(function(d) {
			return d.gendat;
		})
		.transition()
		.ease('linear')
		.duration(1000)
		.attr('y', function(d) { return yScale(d.value) })
		.attr('height', function(d) { return h - yScale(d.value); })
		.attr('opacity', '1');

	//Update labels
	svg.selectAll('.ages')
		.data(dat)
		.selectAll('text')
		.data(function(d) {
			return d.gendat_labs;
		})
		.transition()
		.ease('linear')
		.duration(1000)
		.text(function(d) {
			return d.value;
		})
		.attr('y', function(d) { return yScale(d.value) - 5 })
		.attr('opacity', 1);

	//Hide highlighting
	svg.selectAll('.ages2')
	.data(dat)
	.selectAll('.hlght')
	.data(function(d) {
		return d.gendat;
	})
	.attr('opacity', '0');

	//Hide change anno
	svg.selectAll('.ages3')
	.data(dat2)
	.selectAll('.change')
	.data(function(d) {
		return d.gendat;
	})

	.attr('opacity', '0');

	//Update axes
	// svg.select('.xaxis')
	// 	.call(xAxis);
	// svg.select('.yaxis')
	// 	.call(yAxis);

	//Update title
	svg.select('.title')
		.transition()
		.text('Suicide rates in ' + new_year + ' by gender: United States');

};



