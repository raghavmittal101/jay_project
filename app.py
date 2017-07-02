# This is a flask app. Written in Python3.5

from flask import Flask, jsonify, abort, render_template, request

# this custom module contains functions to connect to GSheets
# and read or write to sheets.
import sheets_api as sa

# `flask_cors` allows cross origin resource sharing
# which is required to talk between Javascript and backend API
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

def parseJSON(json_obj):
	"""
	This parser function is specific to the present JSON output.
	The output JSON object must look like this
	{
		"id" : ' ',
		"list" : [..., ]
	}
	"""
	a = [json_obj['id']]
	for i in json_obj['list']:
		for j in i:
			a.append(i[j])
	return a

@app.route('/')
def index():
	"""
	Function to render the index page, that is j9.html.
	"""
	return (render_template('j9.html'))

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
	app.run(debug=True)
