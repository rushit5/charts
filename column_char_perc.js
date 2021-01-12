looker.plugins.visualizations.add({
create: function(element, config) {
  element.innerHTML = `
	<style>
	.sannith {
	min-width: 200px;
	height: 290px
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
	var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,{calc: "stringify",sourceColumn: 1,type: "string",role: "annotation"}
			,2,3,{calc: "stringify",sourceColumn: 3,type: "string",role: "annotation"},4]);
                      
        var options = {
	  legend: {position: 'bottom'},
	  vAxis: {format: 'percent'},
	  vAxis: {gridlines:{count:0}},
          chartArea:{left:40,top:10,width:'100%',height:'55%'},
          bar:{groupWidth:'85%'},
	  annotations:{alwaysOutside:true},	
	  series: {
            0: { axis: 'Total Count' ,  color : '#92CF50' }, 
            1: { axis: 'Goal' ,  color : '#aba9ad' } 
          }
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('container'));

        //chart.draw(data,options);
	chart.draw(view,options);

      }

doneRendering();
}
})
