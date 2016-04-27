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
				.range(["#aec7e8", "#1f77b4"]);

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
dataset = [{"Gender":"Male","AgeGrp":"10–14","1999":1.9,"2014":2.6},
			{"Gender":"Male","AgeGrp":"15–24","1999":16.8,"2014":18.2},
			{"Gender":"Male","AgeGrp":"25–44","1999":21.6,"2014":24.3},
			{"Gender":"Male","AgeGrp":"45–64","1999":20.8,"2014":29.7},
			{"Gender":"Male","AgeGrp":"65–74","1999":24.7,"2014":26.6},
			{"Gender":"Male","AgeGrp":"75 and over","1999":42.4,"2014":38.8},
			{"Gender":"Female","AgeGrp":"10–14","1999":0.5,"2014":1.5},
			{"Gender":"Female","AgeGrp":"15–24","1999":3,"2014":4.6},
			{"Gender":"Female","AgeGrp":"25–44","1999":5.5,"2014":7.2},
			{"Gender":"Female","AgeGrp":"45–64","1999":6,"2014":9.8},
			{"Gender":"Female","AgeGrp":"65–74","1999":4.1,"2014":5.9},
			{"Gender":"Female","AgeGrp":"75 and over","1999":4.5,"2014":4}];

var agesDups = dataset.map(function(d) {
				return d.AgeGrp;});
var ages = agesDups.filter(function(elem, pos) {
				return agesDups.indexOf(elem) == pos;});

var years = d3.keys(dataset[0]).filter(function(key) {
				return key !== "Gender" & key !== "AgeGrp";});

dataset.forEach(function(d) {
	d.yrdat = years.map(function(series) {
		return { year: series, value: +d[series]};
	});
});

var dat = dataset.filter(function(d) {
	return d.Gender == "Male"; 
});

//Finish defining scales
xScale.domain(ages);

bScale.domain(years)
	.rangeRoundBands([0, xScale.rangeBand()]);

yScale.domain([0, d3.max(dat, function(d) {
	return d3.max(d.yrdat, function(d) {
		return d.value;});})]);

	//Create bars
	var bars = svg.selectAll(".ages")
					.data(dat)
					.enter()
					.append('g')
					.attr('class', 'ages')
					.attr('transform', function(d) {
						return 'translate(' + xScale(d.AgeGrp) + ', 0)'; });
	bars.selectAll('rect')
		.data(function(d) {
			return d.yrdat;
		})
		.enter()
		.append('rect')
		.attr('width', bScale.rangeBand())
		.attr('x', function(d) { return bScale(d.year) })
		.attr('y', function(d) { return yScale(d.value) })
		.attr('height', function(d) { return h - yScale(d.value); })	
		//Still ahve to add padding to left and bottom for placement
		.attr('transform', 'translate(' + m.left + ', ' + m.bottom + ')')
		.style('fill', function(d) { return color(d.year) });

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
		.text('Suicide rates for males by age: United States, 1999 and 2014');

	//Add legend
	var legend = svg.selectAll('.legend')
		.data(years.slice())
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
		.attr('x', m.left + 60)
		.attr('y', m.top + 23)
		.style('text-anchor', 'end')
		.text(function(d) { return d; });


var updateData = function(sel) {
	var new_gender = sel.value;
	var dat = dataset.filter(function(d) {
		return d.Gender == new_gender; 
	});

	// yScale.domain([0, d3.max(dat, function(d) {
	// 	return d3.max(d.yrdat, function(d) {
	// 		return d.value;});})]);

	//Update bars
	svg.selectAll(".ages")
		.data(dat)
		.selectAll('rect')
		.data(function(d) {
			return d.yrdat;
		})
		.transition()
		.duration(1000)
		.attr('y', function(d) { return yScale(d.value) })
		.attr('height', function(d) { return h - yScale(d.value); })	

	//Update axes
	svg.select('.xaxis')
		.call(xAxis);
	// svg.select('.yaxis')
	// 	.call(yAxis);

	//Add title
	svg.select('.title')
		.transition()
		.text('Suicide rates for ' + new_gender.toLowerCase() + 's' + ' by age: United States, 1999 and 2014');

};







