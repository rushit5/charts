looker.plugins.visualizations.add({
create: function(element, config) {
  element.innerHTML = `
	<style>
	.sannith {
	min-width: 210px;
	height: 280px
	}
	</style>
	`;
	
    var container = element.appendChild(document.createElement("div"));
	container.className = "sannith";
    container.id = 'container';
		
  },

updateAsync: function(data, element, config, queryResponse, details, doneRendering) {
// Clear any errors from previous updates:
this.clearErrors();

// Dump data and metadata to console:
console.log('updateAsync() data', data)
console.log('updateAsync() config', config)
console.log('updateAsync() queryResponse', queryResponse)
	
// get the names of the first dimension and measure available in data

x  = config.query_fields.dimensions[0].name;     // quater
y  = config.query_fields.dimensions[1].name;     // total count
z  = config.query_fields.dimensions[2].name;     // BM total count
a  = config.query_fields.dimensions[3].name;     // color codes

 
var quarter = [];
for(var row of data) {
	var cell = row[queryResponse.fields.dimensions[0].name]
	quarter.push([
		row[x].value 
	]);
}

var tot_cnt = [];
for(var row of data) {
	var cell = row[queryResponse.fields.dimensions[1].name]
	tot_cnt.push([
		row[y].value 
	]);
}
var bm_data = [];
for(var row of data) {
	var cell = row[queryResponse.fields.dimensions[2].name]
	bm_data.push([
		row[z].value 
	]);
}

var plot_data = [];
for(var row of data) {
	var cell = row[queryResponse.fields.dimensions[0].name]
	plot_data.push({
	       y     : row[y].value,
	       color : row[a].value  		      
	});
}

console.log('Color', plot_data)	
 	 
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: quarter
    },
    legend: {
        shadow: false
    },
    tooltip: {
        shared: true
    },
    plotOptions: {
        column: {
            grouping: true,
            shadow: false,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Goal',
        color: "#aba9ad",
        data: bm_data,
        pointPadding: 0,
        pointPlacement: 0
    }, {
        name: 'Total Count',
		color: "#44cf3a",
        data: plot_data,
        pointPadding: 0,
        pointPlacement: 0
    }]
})
 
doneRendering();
}
})
