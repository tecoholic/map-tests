# Polymaps-js
This folder contains code written using [Polymaps](http://www.polymaps.org) javascript library as the frontend.

## Files Worth documenting

* __fromScratch.html__ = This was written to know the working of the polymaps library and lead to the development of [OSM2GEO][]
* __busRoute.html__ = This is the Road Congestion Map drawn using the speed values from GPS log of a MTC bus. The base data is the _busroute.csv_, the _path.php_ files parses this csv and retruns the requested GeoJSON.
* __*.osm files__ = OpenStreetMap export files used to test [OSM2GEO][] and draw in _fromScratch.html_
* __test.html__ = A copy of Polymaps [Streets Example](http://polymaps.org/ex/streets.html) to study the library
* __data.json__ = Data used in _test.html_
* __js/osm2geo.js__ = The original [OSM2GEO][], where development and testing takes place.

[OSM2GEO]: https://gist.github.com/1396990

