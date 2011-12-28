$(document).ready(function(){

    var map = new L.Map('map');
    var cloudUrl = "http://{s}.tile.cloudmade.com/d2126e5f6bd740079852c1ee3a900d68/22677/256/{z}/{x}/{y}.png",
    cloudAttr = 'Map tile data &copy; 2011 OpenStreetMap, Tiles &copy; 2011 CloudMade, Overlay Data: MTC Bus GPS Log Sample',
    cloudmade = new L.TileLayer(cloudUrl, {minZoom: 10, maxZoom: 15, attribution: cloudAttr});

// 80.204895,13.069958 -104.98999178409576, 39.74683938093904
var avadi = new L.LatLng(13.00, 80.204895);
map.setView(avadi, 12).addLayer(cloudmade);

var routesList = new Object;
var files = new Array;
var layersControl = new Object;

$('#render').click(function(){
    // Open modal
    $("#modal").html('Kindly Wait ...').dialog({
            height: 100,
            modal: true,
            resizable: false
        }).prev('.ui-dialog-titlebar').css({'display':'none'});

    // ------- remove previous data ----------
    for(var j in files){
        map.removeLayer(files[j]);
    }
    if(layersControl.getPosition){
        map.removeControl(layersControl);
    }
    files.length = 0; //empty the geojson layers
    routesList.length = 0; //empty the array that holds control refs

    // --------- Add new data -----------
    var url = "path.php?hour="+$('#timeframe').val().split(".")[0]+"&min="+$('#timeframe').val().split(".")[1];
    $.getJSON(url, function(routes){
        $(routes).each(function(i,route){
            var geo = route.geojson;
            files.push(new L.GeoJSON());
            files[i].on("featureparse", function(e){
                // Styling
                var color;
                if(e.properties.speed < 10){ color = 'black'; }
                else if (e.properties.speed > 10 && e.properties.speed < 20 ){color='red';}
                else if (e.properties.speed > 20 && e.properties.speed < 30 ){color='yellow';}
                else if (e.properties.speed > 30 ){color='green'}
                e.layer.setStyle({
                    "weight":5,
                    "color": color,
                    "opacity": 1
                });
                // Popup
                e.layer.bindPopup( e.properties.distance*1000.00+ " m<br />" + e.properties.speed + " km/hr<br />" + e.properties.time);
                // Visual feedback of Clicks :P
                e.layer.on('click', function(){
                    e.layer.setStyle({'opacity' : 0.5});
                });
            });

            map.addLayer(files[i]);
            files[i].addGeoJSON(geo);
            routesList[route.trace_name] = files[i];
        });
        layersControl = new L.Control.Layers(null, routesList);
        map.addControl(layersControl);
        $('#modal').dialog('close'); // close the loading modal once everything is done
    });
});

// doc ready close brace
});

