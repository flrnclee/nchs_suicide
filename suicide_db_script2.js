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
dataset = [{"AgeGrp":"10 to 14","Year":"1999","Female":0.5,"Male":1.9},
		{"AgeGrp":"15 to 24","Year":"1999","Female":3,"Male":16.8},
		{"AgeGrp":"25 to 44","Year":"1999","Female":5.5,"Male":21.6},
		{"AgeGrp":"45 to 64","Year":"1999","Female":6,"Male":20.8},
		{"AgeGrp":"65 to 74","Year":"1999","Female":4.1,"Male":24.7},
		{"AgeGrp":"75 and over","Year":"1999","Female":4.5,"Male":42.4},
		{"AgeGrp":"10 to 14","Year":"2014","Female":1.5,"Male":2.6},
		{"AgeGrp":"15 to 24","Year":"2014","Female":4.6,"Male":18.2},
		{"AgeGrp":"25 to 44","Year":"2014","Female":7.2,"Male":24.3},
		{"AgeGrp":"45 to 64","Year":"2014","Female":9.8,"Male":29.7},
		{"AgeGrp":"65 to 74","Year":"2014","Female":5.9,"Male":26.6},
		{"AgeGrp":"75 and over","Year":"2014","Female":4,"Male":38.8}];

var agesDups = dataset.map(function(d) {
				return d.AgeGrp;});
var ages = agesDups.filter(function(elem, pos) {
				return agesDups.indexOf(elem) == pos;});

var genders = d3.keys(dataset[0]).filter(function(key) {
				return key !== "Year" & key !== "AgeGrp";});

dataset.forEach(function(d) {
	d.gendat = genders.map(function(series) {
		return { gender: series, value: +d[series] };
	});
});

dataset.forEach(function(d) {
	d.gendat_labs = genders.map(function(series) {
		return { gender: series, value: d3.format('.1f')(+d[series])};
	});
});


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
	data_use.selectAll('rect')
		.data(function(d) {
			return d.gendat;
		})
		.enter()
		.append('rect')
		.attr('width', bScale.rangeBand())
		.attr('x', function(d) { return bScale(d.gender) })
		.attr('y', function(d) { return yScale(d.value) })
		.attr('height', function(d) { return h - yScale(d.value); })	
		//Still ahve to add padding to left and bottom for placement
		.attr('transform', 'translate(' + m.left + ', ' + m.bottom + ')')
		.style('fill', function(d) { return color(d.gender) });

	//Add data labels
	var lbl = data_use.selectAll('text')
		.data(function(d) {
			return d.gendat_labs;
		})
		.enter()
		.append('text')
	lbl.text(function(d) {
		return d.value;
	})
	.attr('text-anchor', 'middle')
	.attr('x', function(d) { return bScale(d.gender) + 20 })
	.attr('y', function(d) { return yScale(d.value) - 5 })
	.attr('transform', 'translate(' + m.left + ',' + m.bottom + ')');


	//Finish creating axes
	svg.append('g')
		.attr('class', 'xaxis')
		//Still have to add padding to left and bottom for placement
		.attr('transform', 'translate(' + m.left + ', ' + (h + m.bottom) + ')')
		.call(xAxis);
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

	//Update axes
	svg.select('.xaxis')
		.call(xAxis);
	// svg.select('.yaxis')
	// 	.call(yAxis);

	//Add title
	svg.select('.title')
		.transition()
		.text('Suicide rates in ' + new_year + ' by gender: United States');
};



