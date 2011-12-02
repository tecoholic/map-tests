<?php
error_reporting(-1);
// PHP script to split the csv file and return requested data as JSON
$file = "/home/teco/Projects/map-tests/polymaps-js/busroute.csv";
$row = 1;
$geo = array("type" => "FeatureCollection",
             "features" => array(),
         );
if (($handle = fopen($file, "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        $num = count($data);
        if($row != 1){
            $lat = 0+$data[$num-2];
            $lon = 0+$data[$num-1];
            $feature = array("type" => "Feature",
                            "geometry" => array(
                                "type" => "Point",
                                "coordinates" => array($lon, $lat)
                            ),
                            "properties" => array("speed" => 0+$data[1], "time" => $data[0])
                        );
            array_push($geo["features"],$feature);
        }
        else{
            // array_push($geo["features"],array("lastField" => $data[$num-2]));
        }
        $row++;

    }
    fclose($handle);
}
else die("error opening file");

echo(json_encode($geo));
?>
