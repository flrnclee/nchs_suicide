//Actual SVG dimensions: 800 x 500
//Omitting margins in w & h assignment is useful for creating scales

var m = {left: 50, right: 50, top: 50, bottom: 50};
var w = 800 - m.left - m.right;
var h = 500 - m.top - m.bottom;

//Create scales
//Scale for each age group
var xScale = d3.scale.ordinal()
			.rangeRoundBands([0, w], .2);

//Scale for each year
var bScale = d3.scale.ordinal();

//Scale for rate
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
var svg = d3.select('body')
			.append('svg')
			.attr('width', w + m.left + m.right)
			.attr('height', h + m.top + m.bottom);
svg.append('g');

//Read data in 
var dataset = [{"AgeGrp":"10 to 14","Year":"1999","Female":0.5,"Male":1.9,"c_Female":200,"c_Male":36.8421,"c_Female_Icon":"↑","c_Male_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Color":"#A62A2A"},
				{"AgeGrp":"10 to 14","Year":"2014","Female":1.5,"Male":2.6,"c_Female":200,"c_Male":36.8421,"c_Female_Icon":"↑","c_Male_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Color":"#A62A2A"},
				{"AgeGrp":"15 to 24","Year":"1999","Female":3,"Male":16.8,"c_Female":53.3333,"c_Male":8.3333,"c_Female_Icon":"↑","c_Male_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Color":"#A62A2A"},
				{"AgeGrp":"15 to 24","Year":"2014","Female":4.6,"Male":18.2,"c_Female":53.3333,"c_Male":8.3333,"c_Female_Icon":"↑","c_Male_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Color":"#A62A2A"},
				{"AgeGrp":"25 to 44","Year":"2014","Female":7.2,"Male":24.3,"c_Female":30.9091,"c_Male":12.5,"c_Female_Icon":"↑","c_Male_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Color":"#A62A2A"},
				{"AgeGrp":"25 to 44","Year":"1999","Female":5.5,"Male":21.6,"c_Female":30.9091,"c_Male":12.5,"c_Female_Icon":"↑","c_Male_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Color":"#A62A2A"},
				{"AgeGrp":"45 to 64","Year":"2014","Female":9.8,"Male":29.7,"c_Female":63.3333,"c_Male":42.7885,"c_Female_Icon":"↑","c_Male_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Color":"#A62A2A"},
				{"AgeGrp":"45 to 64","Year":"1999","Female":6,"Male":20.8,"c_Female":63.3333,"c_Male":42.7885,"c_Female_Icon":"↑","c_Male_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Color":"#A62A2A"},
				{"AgeGrp":"65 to 74","Year":"1999","Female":4.1,"Male":24.7,"c_Female":43.9024,"c_Male":7.6923,"c_Female_Icon":"↑","c_Male_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Color":"#A62A2A"},
				{"AgeGrp":"65 to 74","Year":"2014","Female":5.9,"Male":26.6,"c_Female":43.9024,"c_Male":7.6923,"c_Female_Icon":"↑","c_Male_Icon":"↑","c_Female_Color":"#A62A2A","c_Male_Color":"#A62A2A"},
				{"AgeGrp":"75 and over","Year":"1999","Female":4.5,"Male":42.4,"c_Female":-11.1111,"c_Male":-8.4906,"c_Female_Icon":"↓","c_Male_Icon":"↓","c_Female_Color":"#608341","c_Male_Color":"#608341"},
				{"AgeGrp":"75 and over","Year":"2014","Female":4,"Male":38.8,"c_Female":-11.1111,"c_Male":-8.4906,"c_Female_Icon":"↓","c_Male_Icon":"↓","c_Female_Color":"#608341","c_Male_Color":"#608341"}];

var agesDups = dataset.map(function(d) {
				return d.AgeGrp;});
var ages = agesDups.filter(function(elem, pos) {
				return agesDups.indexOf(elem) == pos;});

var genders = d3.keys(dataset[0]).filter(function(key) {
				return key == "Female" | key =="Male" ;});

var gender_change = d3.keys(dataset[0]).filter(function(key) {
				return key == "c_Female" | key == "c_Male";});

var icon_change = d3.keys(dataset[0]).filter(function(key) {
				return key == "c_Female_Icon" | key == "c_Male_Icon";});

var color_change = d3.keys(dataset[0]).filter(function(key) {
				return key == "c_Female_Color" | key == "c_Male_Color";});

dataset.forEach(function(d) {
	d.gendat = genders.map(function(series) {
		return { gender: series, value: +d[series] };
	});
	d.gendat_labs = genders.map(function(series) {
		return { gender: series, value: d3.format('.1f')(+d[series]) };
	});
	d.tip_labs = gender_change.map(function(series) {
		return { change: series, value: Math.abs(+d3.format('.1f')(+d[series])) };
	});
	d.tip_icons = icon_change.map(function(series) {
		return { icon: series, value: d[series] };
	});
	d.tip_col = color_change.map(function(series) {
		return { color: series, value: d[series] };
	});
});

dataset.forEach(function(d) {
	for (i = 0; i < 2; i++) {
		d.gendat[i].change = d.tip_labs[i].value;
		d.gendat[i].icon = d.tip_icons[i].value;
		d.gendat[i].col = d.tip_col[i].value;
	};
})

var dat = dataset.filter(function(d) {
	return d.Year == "1999"; 
});


//Finish defining scales
xScale.domain(ages);

bScale.domain(genders)
	.rangeRoundBands([0, xScale.rangeBand()]);

yScale.domain([0, d3.max(dat, function(d) {
	return d3.max(d.gendat, function(d) {
		return d.value;});})]);

//Create bars
var data_use = svg.selectAll(".ages")
				.data(dat)
				.enter()
				.append('g')
				.attr('class', 'ages')
				.attr('transform', function(d) {
					return 'translate(' + xScale(d.AgeGrp) + ', 0)'; });
var bars = data_use.selectAll('rect')
	.data(function(d) {
		return d.gendat;
	})
	.enter()
	.append('rect')
	.attr('width', bScale.rangeBand())
	.attr('x', function(d) { return bScale(d.gender); })
	.attr('y', function(d) { return yScale(d.value); })
	.attr('height', function(d) { return h - yScale(d.value); })	
	//Still have to add padding to left and bottom for placement
	.attr('transform', 'translate(' + m.left + ', ' + m.bottom + ')')
	.style('fill', function(d) { return color(d.gender) });

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
var lbl = data_use.selectAll('text')
	.data(function(d) {
		return d.gendat_labs;
	})
	.enter()
	.append('text');
lbl.text(function(d) {
	return d.value;
	})
	.attr('text-anchor', 'middle')
	.attr('x', function(d) { return bScale(d.gender) + 20 })
	.attr('y', function(d) { return yScale(d.value) - 5 })
	.attr('transform', 'translate(' + m.left + ',' + m.bottom + ')');

//Add change labels, but hide
var change_lbl = data_use.selectAll('.change')
		.data(function(d) {
			return d.gendat;
		})
		.enter()
		.append('text')
		.attr('class', 'change');

	change_lbl.text(function(d) {
		return d.icon + d.change + '%';
	})
		.attr('text-anchor', 'middle')
		.attr('fill', function(d) { 
			return d.col; })
		.attr('x', function(d) { return bScale(d.gender) + 20 })
		.attr('y', function(d) { return yScale(d.value) - 30 })
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
		.attr('height', function(d) { return h - yScale(d.value); });

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
		.attr('y', function(d) { return yScale(d.value) - 5 });

	if (new_year == "2014") { 
	//If 2014, then show
	svg.selectAll('.ages')
		.data(dat)
		.selectAll('.change')
		.data(function(d) {
			return d.gendat;
		})
		.attr('y', function(d) { return yScale(d.value) - 30 })
		.transition()
		.ease('linear')
		.duration(1000)
		.delay(1500)
		.attr('opacity', '1');
	} else {
	//Else if 1999, then hide
		svg.selectAll('.ages')
		.data(dat)
		.selectAll('.change')
		.data(function(d) {
			return d.gendat;
		})
		.attr('y', function(d) { return yScale(d.value) - 30 })
		.attr('opacity', '0');
	};

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



