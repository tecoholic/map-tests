<?php
error_reporting(-1);

if(isset($_GET["hour"])){ 
  $hour = $_GET["hour"];

} 
if(isset($_GET["min"])){
  $min = $_GET["min"];
}

// Variables and constants
// $file = "busroute.csv";

$geo = array("type" => "FeatureCollection",
             "features" => array(),
         );
// Parse the CSV file
function parseCSV($filename){
    global $hour, $min, $geo;

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
else die("error opening file".$filename);
}

$gps_logs = glob("gps-logs/"."*.csv");
foreach($gps_logs as $file){
    parseCSV($file);
}




echo(json_encode($geo));
?>
