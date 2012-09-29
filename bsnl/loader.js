/*
 * Min Lat: 12.43295
 * Min Lon: 79.44
 * Max Lat: 13.41111
 * Max Lon: 80.32568
 *
 */

$(document).ready(function(){
    // Map initialization and response to the interactions
    var map = L.map('map').setView([13.03, 80.13],11);
    var cloudUrl = "http://{s}.tile.cloudmade.com/"+cloudmadeApiKey+"/998/256/{z}/{x}/{y}.png",
        cloudAttr = 'Map tile data &copy; 2012 <a href="http://wiki.openstreetmap.org">OpenStreetMap</a>, Tiles &copy; 2012 <a href="http://www.cloudmade.com">CloudMade</a>';

    var tileLayer = new L.tileLayer( cloudUrl, { maxZoom: 18, attribution: cloudAttr } );
    map.addLayer( tileLayer );

    var layerControl = new L.control.layers().addTo( map );

    var markers = new L.MarkerClusterGroup({ disableClusteringAtZoom: 14 });

    for( var i=0; i < g3Points.length; i++ ){
        var a = g3Points[ i ];
        var title = a[2];
        var marker = new L.Marker( new L.LatLng( a[0], a[1] ), { title: title } );
        marker.bindPopup( title );
        markers.addLayer( marker );
    }

    map.addLayer( markers );
    layerControl.addOverlay( markers, "Tower Pointers" );

    var circles = new L.layerGroup().addTo( map );

    map.on( 'zoomend', function(e){
        var zoom = this.getZoom();
        if ( zoom > 14 ){
            for ( var i=0; i < g3Points.length; i++ ){
                var a = g3Points[i];
                var circ = L.circle([a[0], a[1]], 700, { weight: 3 } );
                circles.addLayer( circ );
                layerControl.addOverlay( circles, "Tower Coverage" );
            }
        }else{
            if( zoom < 15 ){
                circles.clearLayers();
                layerControl.removeLayer( circles );
            }
        }
    });

    // searching based on osm nominatim
    var url = "http://nominatim.openstreetmap.org/search?format=json";
    url += "&viewbox=79.25,13.5,80.5,12.25&bounded=1&q=";

    function update( matches ){
        $("#results").empty();
        if(matches.length === 0){
            $('#results').append( $("<h3>", {text: "No matches found in the Nomanatim Database! Try changing the spelling.",
                class: "ui-widget-content ui-corner-all suggs"}));
        }
        for( var i=0; i<matches.length; i++){
            var ele = matches[i];
            $("#results").append( $("<h3>",{text: ele.display_name, class: "suggs ui-widget-content ui-corner-all"}).bind( 'click', {
                lat: ele.lat,
                lon: ele.lon
            }, function(e){ 
                    map.setView([parseFloat(e.data.lat), parseFloat(e.data.lon)], 15);
            }) );
        }
    }

    function queryNom(){
         $.ajax({
            url : url+$( "#srch" ).val(),
            crossDomain: true,
            success: function( resp ){
                update( $.parseJSON( resp) );
            }
        });
    }

    // The reaction for search button
    $( "#srchBtn" ).click(function(){ queryNom(); } );
    // or use the enter key press in the text box
    $( '#srch' ).keydown( function(e){ if(e.which == 13 ) queryNom(); });

// $.ready close brace
});


