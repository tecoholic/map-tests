'''
This file will take a text file containing the list of addresses to be geocoded as input and return a csv file containing address, latitude, longitude.
This is written to get lat-long for future GIS applications.
'''

# Example code
from geopy import geocoders
g = geocoders.Google()
place, (lat, lng) = g.geocode("Chennai")
print "%s: %f, %f" % (place, lat, lng)

