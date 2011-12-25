<?php
error_reporting(-1);

if(isset($_GET["hour"])){ 
  $hour = $_GET["hour"];

} 
if(isset($_GET["min"])){
  $min = $_GET["min"];
}

// Variables and constants

$traces = array();

// Parse the CSV file and create the GeoJSON
function csv_to_geo($filename){
    global $hour, $min;

    $geo = array("type" => "FeatureCollection",
             "features" => array(),
             );
    $row = 1;
    $preLat = 0;
    $preLon = 0;
    $preset = False;

if (($handle = fopen($filename, "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        $num = count($data);
        if($row != 1){

            $time = date_parse($data[0]);
            if(($time["hour"] === 0+$hour)&&($time["minute"] > $min) && ($time["minute"] < $min+30)){
                // setting starting point
                if(!$preset){
                    $preLat += $data[$num-2];
                    $preLon += $data[$num-1];
                    $preset = True;
                }
                else{
                    $lat = 0+$data[$num-2];
                    $lon = 0+$data[$num-1];
                    $feature = array("type" => "Feature",
                                    "geometry" => array(
                                                        "type" => "LineString",
                                                        "coordinates" => array(array($preLon, $preLat),array($lon, $lat))
                                                        ),
                                    "properties" => array("speed" => 0+$data[1], "time" => $data[0])
                            );
                    array_push($geo["features"],$feature);
                    $preLat = $lat; // reassign lat,lon for next segment
                    $preLon = $lon;
               }
            }

        }
       $row++;

    }
    fclose($handle);
}
else error_log("Error while opening file: ".$filename."\n", 3, "csv-errors.log");

return $geo;

}

// Scan for the files & make geojson
$gps_logs = glob("gps-logs/"."*.csv");
foreach($gps_logs as $file){
    list($dir, $filename) = explode("/", $file);
    array_push($traces, array("trace_name" => $filename,
                             "geojson" => csv_to_geo($file)
                         )
                     );
}
/*
 *  JSON format: [ {
 *                  "trace_name" : "file_name",
 *                  "geojson" : { "type" : "FeatureCollection", "geometry" : .......... }
 *                 },
 *                 {
 *                 "trace_name" : ........ } ]
 *
 */
echo(json_encode($traces));

?>
