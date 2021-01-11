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

var plot_data = [['Q','Total Count',{ role: "style" },'Goal',{ role: "style" }]];
for(var row of data) {
	var cell = row[queryResponse.fields.dimensions[0].name]
	plot_data.push([ 
           row[x].value,
	   row[y].value,
	   'color :'.concat(row[a].value),
	   row[z].value,
	   'color : #aba9ad'
	]);
}

console.log('Color', plot_data)	

google.charts.load('current', {'packages':['corechart', 'bar']});
google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable(plot_data);

        var options = {
          chart: {
            title: '',
            subtitle: '',
          }
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('container'));

        chart.draw(data,options);
      }

doneRendering();
}
})
