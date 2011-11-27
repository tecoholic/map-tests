/**************************************************************************
 *                 OSM2GEO - OSM to GeoJSON converter
 * OSM to GeoJSON converter takes in a .osm XML file as input and produces
 * corresponding GeoJSON object.
 *
 * AUTHOR: P.Arunmozhi <aruntheguy@gmail.com>
 * DATE  : 26 / Nov / 2011 
 * LICENSE : WTFPL - Do What The Fuck You Want To Public License
 * LICENSE URL: http://sam.zoy.org/wtfpl/
 *
 * DEPENDENCY: OSM2GEO entirely depends on jQuery for the XML parsing and
 * DOM traversing. Make sure you include <script src="somewhere/jquery.js">
 * </script> before you include osm2geo.js
 *
 * ***********************************************************************/
var osm2geo = function(osm){
    // Check wether the argument is a Jquery object and act accordingly
    // Assuming it as a raw server response for now
    var $xml = jQuery(osm);
    // Initialize the empty GeoJSON object
    var geo = {
        "type" : "FeatureCollection",
        "features" : []
    };
    // setting the bounding box [minX,minY,maxX,maxY]; x -> long, y -> lat
    function getBounds(bounds){
        var bbox = new Array;
        bbox.push(parseFloat(bounds.attr("minlon")));
        bbox.push(parseFloat(bounds.attr("minlat")));
        bbox.push(parseFloat(bounds.attr("maxlon")));
        bbox.push(parseFloat(bounds.attr("maxlat")));
        return bbox;
    }
    geo["bbox"] = getBounds($xml.find("bounds"));
    // List the ways and get the data
    var $ways = $("way", $xml);
    $ways.each(function(index, ele){
        var feature = {
            "geometry" : {
                "type" : "LineString",
                "coordinates" : []
            },
           "type" : "Feature",
           "properties" : {}
        };
        // List all the nodes
        var nodes = $(ele).find("nd");
        // TODO Find the polygons by comparing first and last node
        nodes.each(function(index, nd){
            var node = $xml.find("node[id='"+$(nd).attr("ref")+"']"); // find the node with id ref'ed in way
            var cords = [parseFloat(node.attr("lon")), parseFloat(node.attr("lat"))]; // get the lat,lon of the node
            feature.geometry.coordinates.push(cords); // save the lat,lon in the feature
        });
        // Save the properties of the way
        var props = $(ele).find("tag");
        props.each(function(index, tag){
            feature.properties[$(tag).attr("k")] = $(tag).attr("v");
        });
        // Save the feature in the Main object
        geo.features.push(feature);
    });
    
    // Finding the point features in the OSM Dataset
    var $points = $("node:has('tag')", $xml);
    $points.each(function(index, ele){
        var feature = {
            "geometry" : {
                "type" : "Point",
                "coordinates" : [parseFloat($(ele).attr('lon')), parseFloat($(ele).attr('lat'))]
            },
           "type" : "Feature",
           "properties" : {}
        };
        var props = $(ele).find("tag");
        props.each(function(inndex, tag){
             feature.properties[$(tag).attr("k")] = $(tag).attr("v");
        });
        // Save the point in Main object
        geo.features.push(feature);
    });
    // Finally return the GeoJSON object
    return geo;

};
