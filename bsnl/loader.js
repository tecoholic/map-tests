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

// $.ready close brace
});


