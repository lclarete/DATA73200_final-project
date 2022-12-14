
    var mapSvg
var mapData, zipCodesData, tooltip, maxValue , year, filteredData, filteredData2;

// This will run when the page loads
document.addEventListener('DOMContentLoaded', () => {
    mapSvg = d3.select('#map').attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+(430)+" "+(580))

    // Load both files before doing anything else
    Promise.all([d3.json('data/zipcodes_nyc-1.json'),
                 d3.csv('data/Demographic_Statistics_By_Zip_Code.csv')])
                 .then(function(values){
                 

        mapData = values[0];
        zipCodesData = values[1];
        tooltip = d3.select('#tooltip').style("opacity", 0)

        var zipcodes = []
                  zipCodesData.forEach((d) => {

                    zipcode = d['JURISDICTION NAME'];
                    zipcodes.push(zipcode)
                    // console.log('value', zipcode , d['JURISDICTION NAME'])
                  });
                  console.log('aaa',zipcodes)

                d3.selectAll("#zip-code")
                    .selectAll('myOptions')
                      .data(zipcodes)
                    .enter()
                      .append('option')
                    .text(function (d) { return d; }) 
                    .attr("value", function (d) { return d; })

                d3.selectAll("#zip-code2")
                    .selectAll('myOptions')
                      .data(zipcodes)
                    .enter()
                      .append('option')
                    .text(function (d) { return d; }) 
                    .attr("value", function (d) { return d; })

        // select attribute
        // -------------------------------------Zip code 1----------------------
        d3.select('#zip-code').on('change', function(){
            selectedAttribute = d3.select('#zip-code').property('value');
            console.log('hi',selectedAttribute)
            filteredData = zipCodesData.filter(d=>{return d['JURISDICTION NAME'] == selectedAttribute})[0]
            console.log(filteredData)
            d3.selectAll('.circle1').attr('opacity' , 0)
            d3.select('circle#z'+selectedAttribute+'.circle1').attr('opacity' , 1).attr('r' ,7)
            d3.selectAll('.text1').attr('opacity' , 0)
            d3.select('text#x'+selectedAttribute+'.text1').attr('opacity' , 1)
            var barData = []
            console.log('1',filteredData)

            barData.push(
            {Attribute: 'Male' ,Value: filteredData['PERCENT MALE']},
            {Attribute: 'Female' ,Value: filteredData['PERCENT FEMALE']})
            // {Attribute: 'Pacific Islander' ,Value: filteredData['PERCENT PACIFIC ISLANDER']},
            drawBar(barData)

            var barData3 = []
            console.log('1',filteredData)
            barData3.push(
              // {Attribute: 'Pacific Islander' ,Value: filteredData['PERCENT PACIFIC ISLANDER']},
              {Attribute: 'Latino' ,Value: filteredData['PERCENT HISPANIC LATINO']},
              {Attribute: 'Asian' ,Value: filteredData['PERCENT ASIAN NON HISPANIC']},
              {Attribute: 'White' ,Value: filteredData['PERCENT WHITE NON HISPANIC']},
              {Attribute: 'Black' ,Value: filteredData['PERCENT BLACK NON HISPANIC']}) 
    
              drawBar3(barData3)

              var barData5 = []
              console.log('1',filteredData)
              barData5.push(
                {Attribute: '% N Receives Public Assistance' ,Value: filteredData['PERCENT RECEIVES PUBLIC ASSISTANCE']},
                {Attribute: 'US Citizen' ,Value: filteredData['PERCENT US CITIZEN']})
                drawBar5(barData5)
        })


//--------------------------------------------- Zip code 2-----------------------------------
        d3.select('#zip-code2').on('change', function(){
            selectedAttribute2 = d3.select('#zip-code2').property('value');
            console.log(selectedAttribute2)
            filteredData2 = zipCodesData.filter(d=>{return d['JURISDICTION NAME'] == selectedAttribute2})[0]
            console.log(filteredData2)
            d3.selectAll('.circle2').attr('opacity' , 0)
            d3.select('circle#x'+selectedAttribute2+'.circle2').attr('opacity' , 1).attr('r' ,7)
            d3.selectAll('.text2').attr('opacity' , 0)
            d3.select('text#x'+selectedAttribute2+'.text2').attr('opacity' , 1)
            var barData2 = []
            
            barData2.push({Attribute: 'Male' ,Value: +filteredData2['PERCENT MALE']},
            {Attribute: 'Female' ,Value: +filteredData2['PERCENT FEMALE']},
            // {Attribute: 'Pacific Islander' ,Value: filteredData2['PERCENT PACIFIC ISLANDER']},
          )


            console.log('fil 2' , barData2)
            drawBar2(barData2)
            var barData4 = []
          
            barData4.push(
            // {Attribute: 'Pacific Islander' ,Value: filteredData4['PERCENT PACIFIC ISLANDER']},
            {Attribute: 'Latino' ,Value: filteredData2['PERCENT HISPANIC LATINO']},
            {Attribute: 'Asian' ,Value: filteredData2['PERCENT ASIAN NON HISPANIC']},
            {Attribute: 'White' ,Value: filteredData2['PERCENT WHITE NON HISPANIC']},
            {Attribute: 'Black' ,Value: filteredData2['PERCENT BLACK NON HISPANIC']})

            console.log('fil bar4' , barData4)
            drawBar4(barData4)


            var barData6 = []
          
            barData6.push(
            // {Attribute: 'Pacific Islander' ,Value: filteredData4['PERCENT PACIFIC ISLANDER']},
            {Attribute: '% N Receives Public Assistance' ,Value: filteredData2['PERCENT RECEIVES PUBLIC ASSISTANCE']},
            {Attribute: 'US Citizen' ,Value: filteredData2['PERCENT US CITIZEN']})
  
  
            console.log('fil bar4' , barData6)
            drawBar6(barData6)
        })        
        
        drawMap();
        
       
    });
});

function drawBar(data){
  var margin = {top: 50, right: 40, bottom: 40, left: 70},
    width = 460 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    d3.select("#my_dataviz svg").remove()

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom))
   .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

           // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 1])
    .range([ 0, width]);

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.Attribute; }))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

    svg
    .append("text")
    .attr('x' , 10)
    .attr('y' , -margin.top/2) //in 2 x oor y ki values ko change krty rha
    .attr('class' , 'header')
    .attr("font-family" , "Ariel")
    .attr("font-size" , "18px")
    .attr("text-anchor", "middle")
    .text('Gender')
    
  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Attribute); })
    .attr("width", function(d) { return x(d.Value); })
    .attr("height", y.bandwidth() )
    .attr("fill", "red")
    .attr('rx', 8)
      svg.selectAll(".textBar")
          .data(data)
          .enter()
          .append("text")
          .attr('class' , 'textBar')
          .attr("x",  function(d) { return x(d.Value)+20;})
          .attr("y", function(d) { return y(d.Attribute)+25; })
          .attr("font-family" , "sans-serif")
          .attr("font-size" , "14px")
          .attr("fill" , "black")
          .attr("text-anchor", "middle")
          .text( function(d) { return ((d.Value * 100).toFixed(0) +'%');})

}

function drawBar3(data){
  var margin = {top: 50, right: 40, bottom: 40, left: 80},
    width = 460 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    d3.select("#my_dataviz3 svg").remove()

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz3")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom))
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

           // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 1])
    .range([ 0, width]);

  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.Attribute; }))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

    svg
    .append("text")
    .attr('x' , 50)
    .attr('y' , -margin.top/2) //in 2 x oor y ki values ko change krty rha
    .attr('class' , 'header')
    .attr("font-family" , "Ariel")
    .attr("font-size" , "18px")
    .attr("text-anchor", "middle")
    .text('Race (Order values - descendent)')

  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Attribute); })
    .attr("width", function(d) { return x(d.Value); })
    .attr("height", y.bandwidth() )
    .attr("fill", "red")
    .attr('rx', 8)

    svg.selectAll(".textBar")
          .data(data)
          .enter()
          .append("text")
          .attr('class' , 'textBar')
          .attr("x",  function(d) { return x(d.Value)+20;})
          .attr("y", function(d) { return y(d.Attribute)+25; })
          .attr("font-family" , "sans-serif")
          .attr("font-size" , "15px")
          .attr("fill" , "black")
          .attr("text-anchor", "middle")
          .text( function(d) { return ((d.Value * 100).toFixed(0) +'%');})
}

function drawBar5(data){
  var margin = {top: 50, right: 40, bottom: 40, left: 80},
    width = 460 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    d3.select("#my_dataviz5 svg").remove()

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz5")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom))
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

           // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 1])
    .range([ 0, width]);

  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.Attribute; }))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

    // svg.append("g")
    //   .attr("class", "y")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(y)
    // .selectAll(".tick text")
    //   .call(wrap, y.rangeBand());
    

    svg
    .append("text")
    .attr('x' , 50)
    .attr('y' , -margin.top/2) //in 2 x oor y ki values ko change krty rha
    .attr('class' , 'header')
    .attr("font-family" , "Ariel")
    .attr("font-size" , "18px")
    .attr("text-anchor", "middle")
    .text('Social')

  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Attribute); })
    .attr("width", function(d) { return x(d.Value); })
    .attr("height", y.bandwidth() )
    .attr("fill", "red")
    .attr('rx', 8)

    svg.selectAll(".textBar")
          .data(data)
          .enter()
          .append("text")
          .attr('class' , 'textBar')
          .attr("x",  function(d) { return x(d.Value)+20;})
          .attr("y", function(d) { return y(d.Attribute)+25; })
          .attr("font-family" , "sans-serif")
          .attr("font-size" , "15px")
          .attr("fill" , "black")
          .attr("text-anchor", "middle")
          .text( function(d) { return ((d.Value * 100).toFixed(0) +'%');})
}

function drawBar2(data){
  var margin = {top: 50, right: 40, bottom: 40, left: 80},
    width = 460 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    d3.select("#my_dataviz2 svg").remove()

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz2")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom))
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

           // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 1])
    .range([ 0, width]);

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.Attribute; }))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

    svg
    .append("text")
    .attr('x' , 10)
    .attr('y' , -margin.top/2) //in 2 x oor y ki values ko change krty rha
    .attr('class' , 'header')
    .attr("font-family" , "Ariel")
    .attr("font-size" , "18px")
    .attr("text-anchor", "middle")
    .text('Gender')

  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Attribute); })
    .attr("width", function(d) { return x(d.Value); })
    .attr("height", y.bandwidth() )
    .attr("fill", "blue")
    .attr('rx', 8)
    // .on('mousemove', function(d) {
    //       d3.select("#tooltip").style("opacity", 1)
    //       .html( +d.Value * 100+'%' )
    //       .style("left", (d3.event.pageX + 10) + "px")
    //       .style("top", (d3.event.pageY - 15) + "px");
    //   })
    //   .on('mouseout', function(d,i) {
    //       d3.select(this).attr("stroke-width" , '1px')
    //       d3.select('#tooltip').style("opacity", 0)
    //   })
    svg.selectAll(".textBar")
          .data(data)
          .enter()
          .append("text")
          .attr('class' , 'textBar')
          .attr("x",  function(d) { return x(d.Value)+20;})
          .attr("y", function(d) { return y(d.Attribute)+25; })
          .attr("font-family" , "sans-serif")
          .attr("font-size" , "15px")
          .attr("fill" , "black")
          .attr("text-anchor", "middle")
          .text( function(d) { return ((d.Value * 100).toFixed(0) +'%');})
}

function drawBar4(data){
  var margin = {top: 50, right: 40, bottom: 40, left: 80},
    width = 460 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    d3.select("#my_dataviz4 svg").remove()

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz4")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom))
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

           // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 1])
    .range([ 0, width]);

  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.Attribute; }))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

    
    svg
    .append("text")
    .attr('x' , 50)
    .attr('y' , -margin.top/2) //in 2 x oor y ki values ko change krty rha
    .attr('class' , 'header')
    .attr("font-family" , "Ariel")
    .attr("font-size" , "18px")
    .attr("text-anchor", "middle")
    .text('Race (Order values - descendent)')

  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Attribute); })
    .attr("width", function(d) { return x(d.Value); })
    .attr("height", y.bandwidth() )
    .attr("fill", "blue")
    .attr('rx', 8)

    svg.selectAll(".textBar")
          .data(data)
          .enter()
          .append("text")
          .attr('class' , 'textBar')
          .attr("x",  function(d) { return x(d.Value)+20;})
          .attr("y", function(d) { return y(d.Attribute)+25; })
          .attr("font-family" , "sans-serif")
          .attr("font-size" , "15px")
          .attr("fill" , "black")
          .attr("text-anchor", "middle")
          .text( function(d) { return ((d.Value * 100).toFixed(0) +'%');})
}

function drawBar6(data){
  var margin = {top: 50, right: 40, bottom: 40, left: 70},
    width = 460 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    d3.select("#my_dataviz6 svg").remove()

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz6")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom))
   .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

           // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 1])
    .range([ 0, width]);

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.Attribute; }))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

    svg
    .append("text")
    .attr('x' , 10)
    .attr('y' , -margin.top/2) //in 2 x oor y ki values ko change krty rha
    .attr('class' , 'header')
    .attr("font-family" , "Ariel")
    .attr("font-size" , "18px")
    .attr("text-anchor", "middle")
    .text('Social')
    
  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Attribute); })
    .attr("width", function(d) { return x(d.Value); })
    .attr("height", y.bandwidth() )
    .attr("fill", "blue")
    .attr('rx', 8)
      svg.selectAll(".textBar")
          .data(data)
          .enter()
          .append("text")
          .attr('class' , 'textBar')
          .attr("x",  function(d) { return x(d.Value)+20;})
          .attr("y", function(d) { return y(d.Attribute)+25; })
          .attr("font-family" , "sans-serif")
          .attr("font-size" , "14px")
          .attr("fill" , "black")
          .attr("text-anchor", "middle")
          .text( function(d) { return ((d.Value * 100).toFixed(0) +'%');})

}


// Draw the map in the #map svg
function drawMap() {
    
    d3.select("#map g").remove();
    // create the map projection and geoPath
    let projection = d3.geoMercator()
                          .fitSize([+mapSvg.style('width').replace('px',''),
                                    700], 
                                    mapData);
    let geoPath = d3.geoPath()
                    .projection(projection);
    
 console.log('mapdata' , mapData)
    // Draw the map   
    let g = mapSvg.append('g');
    let map = g.append("g")
    map.selectAll('.stateMap')
          .data(mapData.features)
          .enter()
          .append('path')
            .attr('d',geoPath)
            .classed('stateMap',true)
            .attr("stroke-width" , '1px')
            .attr("stroke" , 'black')
            .attr('fill' , 'none')
            .on('mouseover', function(d,i) {
                d3.select(this).attr("stroke-width" , '4px')
                d3.select('#tooltip').style("opacity", 1)
            })           
            .on('mousemove', function(d,i) {
                d3.select("#tooltip").style("opacity", 1)
                .html("Postal code: " + d.properties.postalCode )
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px");
            })
            .on('mouseout', function(d,i) {
               d3.select(this).attr("stroke-width" , '1px')
               d3.select('#tooltip').style("opacity", 0)
            })


      map.selectAll(".circle1")
      .data(mapData.features)
      .enter()
      .append("circle")
      .attr('class', 'circle1')
      .attr('id', d=> 'z'+d.properties.postalCode)
      .attr("r",2)
      .style("fill", 'red')
          .attr("opacity", 0)
      .attr("transform",function(d){                 
        var p = projection(d3.geoCentroid(d)); //<-- centroid is the center of the path, projection maps it to pixel positions
        return "translate("+p+")";
      })

      map.selectAll(".text2")
          .data(mapData.features)
          .enter()
          .append("text")
          .attr('class' , 'text2')
          .attr('id', d=> 'x'+d.properties.postalCode)
          .attr("font-family" , "sans-serif")
          .attr("font-size" , "16px")
          .style('font-weight' , 'bold')
          .attr("fill" , "blue")
          .text(d=> { return d.properties.borough})
          .attr("transform",function(d){                 
        var p = projection(d3.geoCentroid(d)); //<-- centroid is the center of the path, projection maps it to pixel positions
        return "translate("+p+")";
      })
      .attr('opacity' , 0)

      map.selectAll(".text1")
          .data(mapData.features)
          .enter()
          .append("text")
          .attr('class' , 'text1')
          .attr('id', d=> 'x'+d.properties.postalCode)
          .attr("font-family" , "sans-serif")
          .attr("font-size" , "16px")
          .style('font-weight' , 'bold')
          .attr("fill" , "red")
          .text(d=> { return d.properties.borough})
          .attr("transform",function(d){                 
        var p = projection(d3.geoCentroid(d)); //<-- centroid is the center of the path, projection maps it to pixel positions
        return "translate("+p+")";
      })
      .attr('opacity' , 0)

      map.selectAll(".circle2")
      .data(mapData.features)
      .enter()
      .append("circle")
      .attr('id', d=> 'x'+d.properties.postalCode)
      .attr('class', 'circle2')
      .attr("r",2)
      .style("fill", 'blue')
      .attr("opacity", 0)
      .attr("transform",function(d){                 
        var p = projection(d3.geoCentroid(d)); //<-- centroid is the center of the path, projection maps it to pixel positions
        return "translate("+p+")";
      })

      var zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', function() {
                g.select('g')
                .attr('transform', d3.event.transform);
            });
    map.call(zoom);
        
   
}
 