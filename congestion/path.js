        /*
            var url2="path.php?";

            if(hour.toString().split(".").length > 1){url2 = url2+"hour="+Math.floor(hour)+"&min=30";}
            else{url2=url2+"hour="+hour+"&min=00";}
        */
/*
        $(function(){
            $(window).resize(function(){
                $("#map").height($(window).height() - 5);
            });
            $('#map').height($(document).height()-5);
        });
*/
        </script>
    </div>
    <script type="text/javascript">
        var map = new L.Map('map');

        var cloudUrl = "http://{s}.tile.cloudmade.com/d2126e5f6bd740079852c1ee3a900d68/22677/256/{z}/{x}/{y}.png",
        cloudAttr = 'Map tile data &copy; 2011 OpenStreetMap, Tiles &copy; 2011 CloudMade, Overlay Data: MTC Bus GPS Log Sample',
        cloudmade = new L.TileLayer(cloudUrl, {maxZoom: 15, attribution: cloudAttr});
       // 80.204895,13.069958 -104.98999178409576, 39.74683938093904
        var avadi = new L.LatLng(13.00, 80.204895);
        map.setView(avadi, 12).addLayer(cloudmade);

        var routesList = new Object;
        var files = new Array;
        var layerscontrol = new Object;

        function render(time){
            $("#modal").dialog({
                    height: 150,
                    modal: true,
                    resizable: false
            });
            $("#modal").prev('.ui-dialog-titlebar').css({'display':'none'});
            var url = "path.php?hour="+time.split(".")[0]+"&min="+time.split(".")[1];
            $.getJSON(url, function(routes){
                    $(routes).each(function(i,route){
                        var geo = route.geojson;
                    try{
                        for(var c=0; c<files.length; c+=1){
                            map.removeLayer(files[c]);
                        }
                    }catch(e){
                        console.log("first lyaer");
                    }
                    files.push(new L.GeoJSON());
                    files[i].on("featureparse", function(e){
                            // Styling
                            var color;
                            if(e.properties.speed < 10){ color = 'black'; }
                            else if (e.properties.speed > 10 && e.properties.speed < 20 ){color='red';}
                            else if (e.properties.speed > 20 && e.properties.speed < 30 ){color='yellow';}
                            else if (e.properties.speed > 30 ){color='green'}
                            e.layer.setStyle({"weight":5,
                                "color": color,
                                "opacity": 1});
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
                    try{
                        map.removeControl(layersControl);
                    }catch(e){
                        console.log("First time creation da ambi."+e);
                    }
                    layersControl = new L.Control.Layers(null, routesList);
                    map.addControl(layersControl);
                    $('#modal').dialog('close');
            });
        }
 
