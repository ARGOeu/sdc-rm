#!/usr/bin/python
'''
SDC needs a page where the list of replication managers
is displayed. Apart from the name of the replication manager
the version , the edmo_code and the datetime of deployement 
is kept.

This script runs every night and saves the data to 
/var/www/html/rmversions.json
'''

import requests
import json
import xmltodict
from shutil import copyfile

HOST_CERT = PATH-TO-CERT-hostcert.pem
HOST_KEY = PATH-TO-KEY-hostkey.pem"
URL_GOCDB = "https://goc-sdc.argo.grnet.gr/gocdbpi/private/?method=get_service_endpoint&service_type=eu.seadatanet.org.replicationmanager"
'''
Get all replication managers from gocdb
'''
url = URL_GOCDB
'''
Try and catch some errors
'''
try:
    response = requests.get(url, cert=(HOST_CERT, HOST_KEY), timeout=30)
except requests.exceptions.HTTPError as errh:
    print ("Http Error:", errh)
    error = errh
    exit()
except requests.exceptions.ConnectionError as errc:
    print ("Error Connecting:", errc)
    error = errc
    exit()
except requests.exceptions.Timeout as errt:
    print ("Timeout Error:", errt)
    error = errt
    exit()
except requests.exceptions.RequestException as err:
    print ("OOps: Something Else", err)
    error = err
    exit()

status_code = response.status_code
xmlResponse = response.content

'''
Read Data from xmltoDict
'''

doc = xmltodict.parse(xmlResponse)

'''
if no results exit
'''
try:
    test = doc['results']['SERVICE_ENDPOINT']
except TypeError:
    exit()

rm = []
rpath = "/ReplicationManager/"
headers = {'Content-Type': 'application/json'}
timeout = 30
for item in doc['results']['SERVICE_ENDPOINT']:
    URL = item['URL']
    u = URL[:-1] + rpath + "monitoring/"
    print "URL" + u
    try:
        response = requests.get(url=u, timeout=timeout, headers=headers)
        response.raise_for_status()
    except requests.exceptions.HTTPError as errh:
        print ("Http Error:", errh)
        error = errh
    except requests.exceptions.ConnectionError as errc:
        print ("Error Connecting:", errc)
        error = errc
    except requests.exceptions.Timeout as errt:
        print ("Timeout Error:", errt)
        error = errt
    except requests.exceptions.RequestException as err:
        print ("OOps: Something Else", err)
        error = err

    status_code = response.status_code
    if response.status_code == 200:
        content = response.json()
        todos = json.loads(response.text)
        rm.append({
              "url": URL,
              "version": todos['version'],
              "edmo_code": todos['edmo_code'],
              "datetime": todos['datetime']
        })
    else:
        rm.append({
              "url": URL,
              "version": "Unknown",
              "edmo_code":  "Unknown",
              "datetime": "Unknown"
        })

jsonfile = "./rmversions.json"
with open(jsonfile, 'w') as outfile:
    json.dump(rm, outfile)

src = jsonfile
dst = "/var/www/html/"+jsonfile
copyfile(src, dst)
