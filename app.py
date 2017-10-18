# This is a flask app. Written in Python3.5

from flask import Flask, jsonify, abort, render_template, request

# this custom module contains functions to connect to GSheets
# and read or write to sheets.
import sheets_api as sa

# `flask_cors` allows cross origin resource sharing
# which is required to talk between Javascript and backend API
from flask_cors import CORS, cross_origin

# for interaction with filesystem. used in countImages() function
import os

app = Flask(__name__)
CORS(app)

def iterateImages(set_name):
	"""
	creating a list for all available images in a folder
	"""
	image_names = []
	for filename in os.listdir(os.path.join('static', 'images', set_name, '')):
		image_names.append(os.path.join(set_name, filename))
	return image_names
		
def countImages(set_name):
	"""
	function to counter number of images inside folder
	"""
	ls = os.listdir('{}{}/'.format('static/images/', set_name))
	count = len(ls)
	return count

def parseJSON(json_obj):
	"""
	This parser function is specific to the present JSON output.
	The input JSON object must look like this
	{
		'imagename': {
			"id" : ' ',
			"user_info" : [..., ..., ],
			"list" : [{'x':..., 'y':..., }, {'x': ..., 'y':..., }, ...]
		},

		'imagename': {
			"id" : ' ',
			"user_info" : [..., ..., ],
			"list" : [{'x':..., 'y':..., }, {'x': ..., 'y':..., }, ...]
		}
	}

	output: [['id', 'info1', 'info2', 'info3', 'x1', 'y1', 'x2', 'y2'.. ],
			['id', 'info1', 'info2', 'info3', 'x1', 'y1', 'x2', 'y2'.. ],
			['id', 'info1', 'info2', 'info3', 'x1', 'y1', 'x2', 'y2'.. ]]
	"""
	b = []
	for i in json_obj:
		a = [json_obj[i]['id']]
		for j in json_obj[i]['user_info']:
			a.append(j)
		for j in json_obj[i]['list']:
			a.append(j['x'])
			a.append(j['y'])
		b.append(a)
	# a = [json_obj['id']]
	# for j in json_obj['user_info']:
	# 	a.append(j)
	# for i in json_obj['list']:
	# 	a.append(i['x'])
	# 	a.append(i['y'])
	return b

@app.route('/')
def index():
	"""
	Function to render the index page, that is j9.html.
	"""
	return (render_template('j9.html', total_img = countImages('set_a'), image_names = iterateImages('set_a')))

@app.route('/api/sheet/read/', methods=['GET'])
def getSheet():
	"""
	Function to read GSheet.
	Return: JSON output.
	"""
	return(jsonify(sa.read()))

@app.route('/api/sheet/write/', methods=['POST'])
def writeSheet():
	"""
	Function to write data to sheets API.
	Input(valid JON object)
	"""
	values = parseJSON(request.json)
	return(jsonify(sa.write(values)))

if __name__ == '__main__':
	"""
	If debug mode is on then errors(if any) will be shown while
	browsing the page.
	"""
	app.run(host='0.0.0.0')
