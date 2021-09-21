import * as d3 from "d3"


var seventyShowing = true
var eightyShowing = true

function init(results) {

	var data = results["sheets"]['data']

	console.log(data)
  
	var dataKeys = Object.keys(data[0])
	// var xVar = dataKeys[4]
	// var yVar = dataKeys[0]
	// var seventies = dataKeys[3]

	const container = d3.select("#graphicContainer")
	const context = d3.select("#stateTargets")

	var today = new Date();

	var options = { day: 'numeric', month: 'long', year: 'numeric' };

	var formatted_date = today.toLocaleString('en-AU', options)

	// context.select("#chartTitle").html(`When might we reach the <b style="color:#2171b5">70%</b> and <b style="color:#ef3b2c">80%</b> vaccination targets if the current rollout rate continues?`)
	// context.select("#sourceText").html('| Sources: CovidLive.com.au, Guardian analysis')

	var isMobile;
	var windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

	var line_stroke_width = 10
	var lolli_r = 10
	var days_offset = 15	
	var circle_stroke_width = 3
	var font_size = 10

	if (windowWidth < 610) {
			isMobile = true;
	}	

	if (windowWidth >= 610){
			isMobile = false;
	}


	// if (isMobile == true){
	// 	line_stroke_width = line_stroke_width/3
	// 	lolli_r = lolli_r/3
	// 	days_offset = days_offset/3
	// 	circle_stroke_width = circle_stroke_width/3
	// 	font_size = font_size/2
	// }

	var width = document.querySelector("#graphicContainer").getBoundingClientRect().width
	var height = 9 * 60				
	var margin = {top: 20, right: 50, bottom: 10, left: 45}

	width = width - margin.left - margin.right;
	height = height - margin.top - margin.bottom;

	var keyWidth = width * 0.3

	if (width < 840) {
		keyWidth = width * 0.5
	}

	if (isMobile) {
		keyWidth = width
	}

    context.select("#graphicContainer svg").remove();
    
    var keyContainer = context.select("#keyContainer");
	keyContainer.html("");

	var svg = context.select("#graphicContainer").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr("id", "svg")
				.attr("overflow", "hidden");	
			

	var features = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var parseTime = d3.timeParse("%Y-%m-%d")
	var formatTime = d3.timeFormat("%-d %b")

	var regExp = /\(([^)]+)\)/;
	
	var allDates = []
	data.forEach(function (d) {
		if (typeof d.eighty_finish_second == "string") {
			d.eighty_finish_second = parseTime(d.eighty_finish_second)
			d.seventy_finish_second = parseTime(d.seventy_finish_second)
			d.eighty_text = formatTime(d.eighty_finish_second)
			d.seventy_text = formatTime(d.seventy_finish_second)
		}
		allDates.push(d.eighty_finish_second)
		allDates.push(d.seventy_finish_second)
		d.recent = +d.recent
	})

	data.sort((a, b) => b.day - a.day);

	var lastUpdated = parseTime(data.filter(r => r.day === 0)[0]['cutoff'])
	const gdnDate = d3.timeFormat("%-d %B, %Y");

	console.log(gdnDate(lastUpdated))
	context.select("#subTitle").html(`Based on the current seven day average of first doses for each state or territory, plus the most recent lag time between first and second doses. Showing estimates ranging from two weeks ago to now. Data last updated ${gdnDate(lastUpdated)}.`)

	console.log("data", data)

	var minDate = d3.min(allDates)
	var maxDate = d3.max(allDates)

	var niceDate = new Date(minDate - 1000 * 60 * 60 * 24 * 3)

	console.log(niceDate)

	var x = d3.scaleTime()
		.range([0, width])
		.domain([niceDate, maxDate])

	var radius = d3.scaleLinear()	
		.range([5,10])
		.domain([0,13])

	var blues = d3.scaleLinear()	
		.range(['#c6dbef','#2171b5'])
		.domain([0,13])	

	var reds = d3.scaleLinear()	
		.range(['#fcbba1','#ef3b2c'])
		.domain([0,13])

	var opacity = d3.scaleLinear()	
		.range([0.1,0.8])
		.domain([0,13])				

	var keyLeftMargin = 20
	
	if (isMobile) {
		keyLeftMargin = 0
	}	

	var keySvg = context.select("#keyContainer").append("svg")
                .attr("width", keyWidth)
                .attr("height", "55px")
                .attr("id", "keySvg")

    var redGradient = keySvg.append("defs")
	  .append("svg:linearGradient")
	  .attr("id", "redGradient")
	  .attr("x1", "0%")
	  .attr("y1", "100%")
	  .attr("x2", "100%")
	  .attr("y2", "100%")
	  .attr("spreadMethod", "pad");

    redGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", reds.range()[0])
      .attr("stop-opacity", 1);

    redGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", reds.range()[1])
      .attr("stop-opacity", 1);

    var blueGradient = keySvg.append("defs")
	  .append("svg:linearGradient")
	  .attr("id", "blueGradient")
	  .attr("x1", "0%")
	  .attr("y1", "100%")
	  .attr("x2", "100%")
	  .attr("y2", "100%")
	  .attr("spreadMethod", "pad");

    blueGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", blues.range()[0])
      .attr("stop-opacity", 1);

    blueGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", blues.range()[1])
      .attr("stop-opacity", 1);  

	keySvg.append("rect")
		.attr("y", 20)
		.attr("x", keyLeftMargin)
		.attr("width", keyWidth - keyLeftMargin)
		.attr("height", 10)
		.style("fill", "url(#redGradient)")

	keySvg.append("rect")
		.attr("y", 30)
		.attr("x", keyLeftMargin)
		.attr("width", keyWidth - keyLeftMargin)
		.attr("height", 10)
		.style("fill", "url(#blueGradient)")	

    keySvg.append("text")
        .attr("x", keyLeftMargin)
        .attr("text-anchor", "start")
        .attr("y", 52)
        .attr("class", "keyLabel").text("2 weeks ago")  

    keySvg.append("text")
        .attr("x", keyWidth)
        .attr("text-anchor", "end")
        .attr("y", 52)
        .attr("class", "keyLabel").text("Now")

     keySvg.append("text")
        .attr("x", keyLeftMargin)
        .attr("text-anchor", "start")
        .attr("y", 15)
        .attr("class", "keyLabel").text("Estimate from")          	

	const xTicks = isMobile ? 4 : 6

	var xAxis;

	xAxis = d3.axisTop(x).tickSizeOuter(0)
		.ticks(xTicks)
		.tickSize(-height, 0, 0)
	    .tickPadding(10)
		.tickFormat(d3.timeFormat('%-d %b'))

	features.append("g")
		.attr("class","axis x dashed")
		.attr("transform", "translate(0," +  margin.top + ")")
		.style("stroke-dasharray", "2 2")  
		.call(xAxis)
		.selectAll("text")
		// .attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "middle")
	
		

	// Y axis
	var y = d3.scaleBand()
	.range([0, height])
	.domain(data.map((d) => d.state))
	.padding(1);

	// var thingo = data.map((d) => d[yVar])

	// console.log(thingo)

	features.append("g")
	.attr("class","axis y")
	.call(d3.axisLeft(y))

	features.selectAll(".domain").remove()  

	features.selectAll("rect")
      .data(d => y.domain())
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", d => y(d) - 10)
      .attr("height", 20)
      .attr("width", 1)
      .attr("fill", "#767676")

	features.selectAll("circles70")
		.data(data)
		.enter()
		.append("circle")
		.attr("class", "seventy")
		.attr("cx", function(d) { return x(d.seventy_finish_second); })
		.attr("cy", function(d) { return y(d.state); })
		.attr("r", d => radius(d.recent))
		.style("fill", d => blues(d.recent))
		.attr("opacity", 0.7)
		.attr("stroke", d => {
				if (d.day === 0) {
					return "#000"
				}

				else {
					return "none"
				}
			})
		.attr("stroke-width",1)	

	features.selectAll("circles80")
		.data(data)
		.enter()
		.append("circle")
		.attr("class", "eighty")
		.attr("cx", function(d) { return x(d.eighty_finish_second); })
		.attr("cy", function(d) { return y(d.state); })
		.attr("r", d => radius(d.recent))
		.style("fill", d => reds(d.recent))
		.attr("opacity", d => opacity(d.recent))
		.attr("stroke", d => {
				if (d.day === 0) {
					return "#000"
				}

				else {
					return "none"
				}
			})
		.attr("stroke-width",1)	


	features.selectAll("circleLine")
		.data(data.filter(r => r.day === 0))
		.enter()
		.append("line")
		.attr("class", "circleLine eighty")
		.attr("x1", d => x(d.eighty_finish_second))
		.attr("x2", d => x(d.eighty_finish_second))
		.attr("y1", d => { 
				return y(d.state) - radius(d.recent)
			})
		.attr("y2", d =>  { return y(d.state) - days_offset})
		.attr("stroke", "#000")
		.attr("stroke-width",1)

	features.selectAll("circleLine")
		.data(data.filter(r => r.day === 0))
		.enter()
		.append("line")
		.attr("class", "circleLine seventy")
		.attr("x1", d => x(d.seventy_finish_second))
		.attr("x2", d => x(d.seventy_finish_second))
		.attr("y1", d => { 
				return y(d.state) - radius(d.recent)
			})
		.attr("y2", d =>  { return y(d.state) - days_offset})
		.attr("stroke", "#000")
		.attr("stroke-width",1)	

	features.selectAll("text80")
		.data(data.filter(r => r.day === 0))
		.enter()
		.append("text")
		.attr("x", d => x(d.eighty_finish_second))
		.attr("text-anchor", "middle")
		.attr("y", d => y(d.state) - days_offset - 2)
		.attr("class", "keyLabel eighty")
		.text(d => d.eighty_text)
		.attr("font-size", 12)

	features.selectAll("text70")
		.data(data.filter(r => r.day === 0))
		.enter()
		.append("text")
		.attr("x", d => x(d.seventy_finish_second))
		.attr("text-anchor", "middle")
		.attr("y", d => y(d.state) - days_offset - 2)
		.attr("class", "keyLabel seventy")
		.text(d => d.seventy_text)
		.attr("font-size", 12)	


	var seventyButton = context.select("#seventyButton")
	var eightyButton = context.select("#eightyButton")

	if (seventyShowing) {
			context.selectAll(".seventy")
				.attr("opacity", 1)	
			seventyButton.classed("blue-button-selected", true)
	}

	else {
		context.selectAll(".seventy")
				.attr("opacity", 0)	
			seventyButton.classed("blue-button-selected", false)
	}

	if (eightyShowing) {
			context.selectAll(".eighty")
				.attr("opacity", 1)	
			eightyButton.classed("red-button-selected", true)
	}

	else {
		context.selectAll(".eighty")
				.attr("opacity", 0)	
			eightyButton.classed("red-button-selected", false)
	}


	seventyButton.on("click", function() {
		if (seventyShowing) {
			context.selectAll(".seventy")
				.transition()
				.attr("opacity", 0)
			seventyShowing = false	
			seventyButton.classed("blue-button-selected", false)
		}

		else {
			context.selectAll(".seventy")
				.transition()
				.attr("opacity", 1)
			seventyShowing = true
			seventyButton.classed("blue-button-selected", true)
		}


	})	

	eightyButton.on("click", function() {
		if (eightyShowing) {
			context.selectAll(".eighty")
				.transition()
				.attr("opacity", 0)
			eightyShowing = false	
			eightyButton.classed("red-button-selected", false)
		}

		else {
			context.selectAll(".eighty")
				.transition()
				.attr("opacity", 1)
			eightyShowing = true
			eightyButton.classed("red-button-selected", true)
		}

	})	

}



Promise.all([
	d3.json('https://interactive.guim.co.uk/yacht-charter-data/new-model-state-projections.json')
	])
	.then((results) =>  {
		init(results[0])
		var to=null
		var lastWidth = document.querySelector("#graphicContainer").getBoundingClientRect()
		window.addEventListener('resize', function() {
			var thisWidth = document.querySelector("#graphicContainer").getBoundingClientRect()
			if (lastWidth != thisWidth) {
				window.clearTimeout(to);
				to = window.setTimeout(function() {
					    init(results[0])
					}, 100)
			}
		
		})

	});
