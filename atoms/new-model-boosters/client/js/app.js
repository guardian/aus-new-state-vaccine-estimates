import * as d3 from "d3"


var seventyShowing = true
var eightyShowing = true
var ninetyShowing = true

// var seventyBoosterShowing = true
// var eightyBoosterShowing = true
// var ninetyBoosterShowing = true

function init(results) {

	var data = results["sheets"]['data']

	console.log("RIGHT AT THE VERY FUCKING START",data)

	console.log("JUST WANT TO MAKE SURE")

	var dataKeys = Object.keys(data[0])

	console.log("Datakeys", dataKeys)
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


	// console.log(today)


	// var cutOff = new Date('2021-10-30')
	// var cutOff = new Date()
	// // cutOff.setDate(today.getDate() + 2)
	// cutOff = today
	// console.log(cutOff);

	// //  Create dict with the latest prediction dates for each state

	// var grouped = d3.groups(data, d => d.state)
	// var most_recent = {}
	// grouped.forEach(function(d) {
	// 	// console.log(d)
	// 	var init_state = d[0]
	// 	console.log(init_state)
	// 	var latest = d[1].filter((d) => d.day == 0)[0]
	// 	console.log(latest)
	// 	most_recent[init_state] = {"70":parseTime(latest['seventy_finish_second']), '80':parseTime(latest['eighty_finish_second'])}

	// })


	// console.log(most_recent)


	var allDates = []
	data.forEach(function (d) {
		// var init_state = most_recent[d.state]
		// console.log(d.state)

		// console.log("70", init_state['70'])
		if (typeof d.eighty_finish_second == "string") {

			d.seventy_finish_second = parseTime(d.booster_finish_80)
			d.eighty_finish_second = parseTime(d.booster_finish_90)
			// d.ninety_finish_second = parseTime(d.booster_finish_90)

			d.seventy_text = formatTime(d.seventy_finish_second)
			d.eighty_text = formatTime(d.eighty_finish_second)
			// d.ninety_text = formatTime(d.ninety_finish_second)

			// // d.booster_seventy_finish = parseTime(d.booster_finish_70)
			// d.booster_eighty_finish = parseTime(d.booster_finish_80)
			// d.booster_ninety_finish = parseTime(d.booster_finish_90)

			// // d.booster_seventy_text = formatTime(d.booster_seventy_finish)
			// d.booster_eighty_text = formatTime(d.booster_eighty_finish)
			// d.booster_ninety_text = formatTime(d.booster_ninety_finish)
		}

		// // If the dates are before the cutoff then we delete them
		// if (init_state['70'] < cutOff){
		// 	// console.log(d)
		// 	console.log("First")
		// 	d.seventy_finish_second = ''
		// 	d.seventy_text = ''
		// 	// allDates.push(d.seventy_finish_second)

		// }

		// if (init_state['80'] < cutOff){
		// 	// allDates.push(d.eighty_finish_second)
		// 	console.log("second")
		// 	d.eighty_text = ''
		// 	d.eighty_finish_second = ''
		// }
		allDates.push(d.seventy_finish_second)
		allDates.push(d.eighty_finish_second)
		// allDates.push(d.ninety_finish_second)

		// allDates.push(d.booster_seventy_finis)
		// allDates.push(d.booster_eighty_finish)
		// allDates.push(d.booster_ninety_finish)
		d.recent = +d.recent
	})

	// console.log(data)

	// console.log("Dates", allDates)

	data.sort((a, b) => b.day - a.day);

	const targetsHit70 = [
		// {"state":"NSW", "date":parseTime("2021-11-08"), "text":"8 Nov"},
		// {"state":"ACT", "date":parseTime("2021-10-27"), "text":"27 Oct"},
		// {"state":"VIC", "date":parseTime("2021-11-24"), "text":"24 Nov"},
		// {"state":"TAS", "date":parseTime("2021-12-10"), "text":"10 Dec"},
		// {"state":"AUS", "date":parseTime("2021-12-16"), "text":"16 Dec"}
	]

	const targetsHit80 = [
		// {"state":"NSW", "date":parseTime("2021-10-16"), "text":"16 Oct"},
		// {"state":"ACT", "date":parseTime("2021-10-17"), "text":"17 Oct"},
		// {"state":"VIC", "date":parseTime("2021-10-30"), "text":"30 Oct"},
		// {"state":"AUS", "date":parseTime("2021-11-05"), "text":"5 Nov"},
		// {"state":"TAS", "date":parseTime("2021-11-09"), "text":"9 Nov"},
		// {"state":"SA", "date":parseTime("2021-11-27"), "text":"27 Nov"},
		// {"state":"QLD", "date":parseTime("2021-12-08"), "text":"8 Dec"},
		// {"state":"NT", "date":parseTime("2021-12-08"), "text":"8 Dec"},
		// {"state":"WA", "date":parseTime("2021-12-13"), "text":"13 Dec"}
	]


	const targetsHit90 = [
		// {"state":"NSW", "date":parseTime("2021-11-08"), "text":"8 Nov"},
		// {"state":"ACT", "date":parseTime("2021-10-27"), "text":"27 Oct"},
		// {"state":"VIC", "date":parseTime("2021-11-24"), "text":"24 Nov"},
		// {"state":"TAS", "date":parseTime("2021-12-10"), "text":"10 Dec"},
		// {"state":"AUS", "date":parseTime("2021-12-16"), "text":"16 Dec"}
	]

	const statesHit70 = targetsHit70.map(d => d.state)
	const statesHit80 = targetsHit80.map(d => d.state)
	const statesHit90 = targetsHit90.map(d => d.state)

	// console.log(statesHit70)

	var lastUpdated = parseTime(data.filter(r => r.day === 0)[0]['cutoff'])
	const gdnDate = d3.timeFormat("%-d %B, %Y");

	// console.log(gdnDate(lastUpdated))
	context.select("#subTitle").html(`Based on the current dosing interval between second and booster doses for each state or territory. Dates where jurisdictions have achieved a target are based on the actual vaccination data date, not the date of reporting. Data as at ${gdnDate(lastUpdated)}`)

	// console.log("data", data)

	var minDate = d3.min(allDates)
	var maxDate = d3.max(allDates)

	// var niceDate = new Date(minDate - 1000 * 60 * 60 * 24 * 3)
	var niceDate = parseTime("2022-02-01")

	// console.log(niceDate)

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

	var purples = d3.scaleLinear()
		.range(['#fcbba1','#713590'])
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



	//   ### Purple gradient

	// var purpleGradient = keySvg.append("defs")
	// .append("svg:linearGradient")
	// .attr("id", "purpleGradient")
	// .attr("x1", "0%")
	// .attr("y1", "100%")
	// .attr("x2", "100%")
	// .attr("y2", "100%")
	// .attr("spreadMethod", "pad");

	// purpleGradient.append("stop")
	// .attr("offset", "0%")
	// .attr("stop-color", purples.range()[0])
	// .attr("stop-opacity", 1);

	// purpleGradient.append("stop")
	// .attr("offset", "100%")
	// .attr("stop-color", purples.range()[1])
	// .attr("stop-opacity", 1);

	keySvg.append("rect")
		.attr("y", 20)
		.attr("x", keyLeftMargin)
		.attr("width", keyWidth - keyLeftMargin)
		.attr("height", 10)
		.style("fill", "url(#blueGradient)")

	keySvg.append("rect")
		.attr("y", 27)
		.attr("x", keyLeftMargin)
		.attr("width", keyWidth - keyLeftMargin)
		.attr("height", 10)
		.style("fill", "url(#redGradient)")

		// keySvg.append("rect")
		// .attr("y", 34)
		// .attr("x", keyLeftMargin)
		// .attr("width", keyWidth - keyLeftMargin)
		// .attr("height", 7)
		// .style("fill", "url(#purpleGradient)")

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

	var data70 = data.filter(d => !statesHit70.includes(d.state))
	var data80 = data.filter(d => !statesHit80.includes(d.state))
	var data90 = data.filter(d => !statesHit90.includes(d.state))



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
		.data(data70)
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

		features.selectAll("reached70")
			.data(targetsHit70)
			.enter()
			.append("circle")
			.attr("class", "seventy")
			.attr("cx", function(d) { return x(d.date); })
			.attr("cy", function(d) { return y(d.state); })
			.attr("r", d => radius(14))
			.style("fill", d => blues(14))
			.attr("opacity", 0.7)
			.attr("stroke", "#000")
			.attr("stroke-width",1)

		features.selectAll("reached70")
			.data(targetsHit70)
			.enter()
			.append("image")
			.attr("xlink:href", '<%= path %>/tick.svg')
			.attr("class", "seventy")
			.attr("width", 14)
			.attr("height", 14)
			.attr("x", function(d) { return x(d.date) - 7; })
			.attr("y", function(d) { return y(d.state) - 7; })


	features.selectAll("circles80")
		.data(data80)
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

		features.selectAll("reached80")
			.data(targetsHit80)
			.enter()
			.append("circle")
			.attr("class", "eighty")
			.attr("cx", function(d) { return x(d.date); })
			.attr("cy", function(d) { return y(d.state); })
			.attr("r", d => radius(14))
			.style("fill", d => reds(14))
			.attr("opacity", 0.7)
			.attr("stroke", "#000")
			.attr("stroke-width",1)

		features.selectAll("reached80")
			.data(targetsHit80)
			.enter()
			.append("image")
			.attr("xlink:href", '<%= path %>/tick.svg')
			.attr("class", "eighty")
			.attr("width", 14)
			.attr("height", 14)
			.attr("x", function(d) { return x(d.date) - 7; })
			.attr("y", function(d) { return y(d.state) - 7; })



// 			// ### Add 90 circles

// 			features.selectAll("circles90")
// .data(data90)
// .enter()
// .append("circle")
// .attr("class", "ninety")
// .attr("cx", function(d) { return x(d.ninety_finish_second); })
// .attr("cy", function(d) { return y(d.state); })
// .attr("r", d => radius(d.recent))
// .style("fill", d => purples(d.recent))
// .attr("opacity", d => opacity(d.recent))
// .attr("stroke", d => {
//         if (d.day === 0) {
//             return "#000"
//         }

//         else {
//             return "none"
//         }
//     })
// .attr("stroke-width",1)

// features.selectAll("reached90")
//     .data(targetsHit90)
//     .enter()
//     .append("circle")
//     .attr("class", "ninety")
//     .attr("cx", function(d) { return x(d.date); })
//     .attr("cy", function(d) { return y(d.state); })
//     .attr("r", d => radius(14))
//     .style("fill", d => purples(14))
//     .attr("opacity", 0.7)
//     .attr("stroke", "#000")
//     .attr("stroke-width",1)

// features.selectAll("reached90")
//     .data(targetsHit90)
//     .enter()
//     .append("image")
//     .attr("xlink:href", '<%= path %>/tick.svg')
//     .attr("class", "ninety")
//     .attr("width", 14)
//     .attr("height", 14)
//     .attr("x", function(d) { return x(d.date) - 7; })
//     .attr("y", function(d) { return y(d.state) - 7; })







	features.selectAll("circleLine")
		.data(data80.filter(r => r.day === 0))
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
		.data(data70.filter(r => r.day === 0))
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

		features.selectAll("circleLine")
		.data(targetsHit70)
		.enter()
		.append("line")
		.attr("class", "circleLine seventy")
		.attr("x1", d => x(d.date))
		.attr("x2", d => x(d.date))
		.attr("y1", d => {
				return y(d.state) - radius(14)
			})
		.attr("y2", d =>  { return y(d.state) - days_offset})
		.attr("stroke", "#000")
		.attr("stroke-width",1)

		features.selectAll("circleLine")
		.data(targetsHit80)
		.enter()
		.append("line")
		.attr("class", "circleLine eighty")
		.attr("x1", d => x(d.date))
		.attr("x2", d => x(d.date))
		.attr("y1", d => {
				return y(d.state) - radius(14)
			})
		.attr("y2", d =>  { return y(d.state) - days_offset})
		.attr("stroke", "#000")
		.attr("stroke-width",1)


		// ### Ninety circle line

		features.selectAll("circleLine")
		.data(targetsHit90)
		.enter()
		.append("line")
		.attr("class", "circleLine ninety")
		.attr("x1", d => x(d.date))
		.attr("x2", d => x(d.date))
		.attr("y1", d => {
				return y(d.state) - radius(14)
			})
		.attr("y2", d =>  { return y(d.state) - days_offset})
		.attr("stroke", "#000")
		.attr("stroke-width",1)


		features.selectAll("circleLine")
		.data(data90.filter(r => r.day === 0))
		.enter()
		.append("line")
		.attr("class", "circleLine ninety")
		.attr("x1", d => x(d.ninety_finish_second))
		.attr("x2", d => x(d.ninety_finish_second))
		.attr("y1", d => {
				return y(d.state) - radius(d.recent)
			})
		.attr("y2", d =>  { return y(d.state) - days_offset})
		.attr("stroke", "#000")
		.attr("stroke-width",1)




	features.selectAll("text80")
		.data(data80.filter(r => r.day === 0))
		.enter()
		.append("text")
		.attr("x", d => x(d.eighty_finish_second))
		.attr("text-anchor", "middle")
		.attr("y", d => y(d.state) - days_offset - 2)
		.attr("class", "keyLabel eighty")
		.text(d => d.eighty_text)
		.attr("font-size", 12)

	features.selectAll("text80")
		.data(targetsHit80)
		.enter()
		.append("text")
		.attr("x", d => x(d.date))
		.attr("text-anchor", "middle")
		.attr("y", d => y(d.state) - days_offset - 2)
		.attr("class", "keyLabel eighty")
		.text(d => d.text)
		.attr("font-size", 12)

	features.selectAll("text70")
		.data(data70.filter(r => r.day === 0))
		.enter()
		.append("text")
		.attr("x", d => x(d.seventy_finish_second))
		.attr("text-anchor", "middle")
		.attr("y", d => y(d.state) - days_offset - 2)
		.attr("class", "keyLabel seventy")
		.text(d => d.seventy_text)
		.attr("font-size", 12)

	features.selectAll("text70")
		.data(targetsHit70)
		.enter()
		.append("text")
		.attr("x", d => x(d.date))
		.attr("text-anchor", "middle")
		.attr("y", d => y(d.state) - days_offset - 2)
		.attr("class", "keyLabel seventy")
		.text(d => d.text)
		.attr("font-size", 12)


		features.selectAll("text90")
		.data(data90.filter(r => r.day === 0))
		.enter()
		.append("text")
		.attr("x", d => x(d.ninety_finish_second))
		.attr("text-anchor", "middle")
		.attr("y", d => y(d.state) - days_offset - 2)
		.attr("class", "keyLabel ninety")
		.text(d => d.ninety_text)
		.attr("font-size", 12)

	features.selectAll("text90")
		.data(targetsHit90)
		.enter()
		.append("text")
		.attr("x", d => x(d.date))
		.attr("text-anchor", "middle")
		.attr("y", d => y(d.state) - days_offset - 2)
		.attr("class", "keyLabel ninety")
		.text(d => d.text)
		.attr("font-size", 12)

// 		console.log("I done that")

// 			console.log(booster70)

// 			booster70.forEach(function(d){
// 				// console.log(x(d.booster_finish_70))
// 				console.log(d.booster_seventy_finish)
// 			})

// 	features.selectAll("boosters70")
// 		.data(booster70)
// 		.enter()
// 		.append("rect")
// 		.attr("class", "boostSeventy")
// 		// .attr("rx", 10)
// 		// .attr('ry', 10)
// 		.attr("width", 20)
// 		.attr("height", 20)
// 		.attr("x", function(d) { return x(d.booster_seventy_finish); })
// 		.attr("y", function(d) { return y(d.state); })
// 		.style("fill", d => blues(d.recent))
// 		.attr("opacity", 0.7)
// 		.attr("stroke", d => {
// 				if (d.day === 0) {
// 					return "#000"
// 				}

// 				else {
// 					return "none"
// 				}
// 			})
// 		.attr("stroke-width",1)


// 		console.log("I done that")


// 		features.selectAll("boosters80")
// .data(booster70)
// .enter()
// .append("rect")
// .attr("class", "boostEighty")
// // .attr("rx", 10)
// // .attr('ry', 10)
// .attr("width", 20)
// .attr("height", 20)
// .attr("x", function(d) { return x(d.booster_eighty_finish); })
// .attr("y", function(d) { return y(d.state); })
// .style("fill", d => reds(d.recent))
// .attr("opacity", 0.7)
// .attr("stroke", d => {
//         if (d.day === 0) {
//             return "#000"
//         }

//         else {
//             return "none"
//         }
//     })
// .attr("stroke-width",1)


// features.selectAll("boosters90")
// .data(booster70)
// .enter()
// .append("rect")
// .attr("class", "boostNinety")
// // .attr("rx", 10)
// // .attr('ry', 10)
// .attr("width", 20)
// .attr("height", 20)
// .attr("x", function(d) { return x(d.booster_ninety_finish); })
// .attr("y", function(d) { return y(d.state); })
// .style("fill", d => purples(d.recent))
// .attr("opacity", 0.7)
// .attr("stroke", d => {
//         if (d.day === 0) {
//             return "#000"
//         }

//         else {
//             return "none"
//         }
//     })

	var seventyButton = context.select("#seventyButton")
	var eightyButton = context.select("#eightyButton")
	var ninetyButton = context.select("#ninetyButton")

	if (seventyShowing) {
			context.selectAll(".seventy")
				.attr("opacity", d => opacity(d.recent))
			seventyButton.classed("blue-button-selected", true)
	}

	else {
		context.selectAll(".seventy")
				.attr("opacity", 0)
			seventyButton.classed("blue-button-selected", false)
	}

	if (eightyShowing) {
			context.selectAll(".eighty")
				.attr("opacity", d => opacity(d.recent))
			eightyButton.classed("red-button-selected", true)
	}

	else {
		context.selectAll(".eighty")
				.attr("opacity", 0)
			eightyButton.classed("red-button-selected", false)
	}

// ## ninety
	if (ninetyShowing) {
		context.selectAll(".ninety")
			.attr("opacity", d => opacity(d.recent))
		ninetyButton.classed("purple-button-selected", true)
	}

	else {
	context.selectAll(".ninety")
			.attr("opacity", 0)
		ninetyButton.classed("purple-button-selected", false)
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
				.attr("opacity", d => opacity(d.recent))
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
				.attr("opacity", d => opacity(d.recent))
			eightyShowing = true
			eightyButton.classed("red-button-selected", true)
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
				.attr("opacity", d => opacity(d.recent))
			eightyShowing = true
			eightyButton.classed("red-button-selected", true)
		}

	})



	ninetyButton.on("click", function() {
		if (ninetyShowing) {
			context.selectAll(".ninety")
				.transition()
				.attr("opacity", 0)
			ninetyShowing = false
			ninetyButton.classed("purple-button-selected", false)
		}

		else {
			context.selectAll(".ninety")
				.transition()
				.attr("opacity", d => opacity(d.recent))
			ninetyShowing = true
			ninetyButton.classed("purple-button-selected", true)
		}

	})


}



Promise.all([
	d3.json('https://interactive.guim.co.uk/yacht-charter-data/new-model-state-projections-boosters-testo.json')
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
