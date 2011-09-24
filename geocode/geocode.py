'''
This file will take a text file containing the list of addresses to be geocoded as input and return a csv file containing address, latitude, longitude.
This is written to get lat-long for future GIS applications.
'''

'''
# Example code
from geopy import geocoders
g = geocoders.Google()
place, (lat, lng) = g.geocode("Chennai")
print "%s: %f, %f" % (place, lat, lng)

'''

import sys

from geopy import geocoders

def geocode_file(filename):
    ''' This is the main function '''
    f = open(filename, 'r+')
    o = open("output.txt", "w")
    for place in f:
        g = geocoders.Google()
        pla, (lat,lng) = list(g.geocode(place, exactly_one = False))[0]
        o.write(pla.split(",")[0]+","+str(lat)+","+str(lng))
    f.close()
    o.close()

if __name__ == '__main__':
    if len(sys.argv) == 2:
        geocode_file(sys.argv[1])
    else:
        print "Error:"
        print "File Usage: geocode.py input_file.txt"

