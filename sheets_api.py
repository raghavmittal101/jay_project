import httplib2
from apiclient import discovery
from oauth2client import client
from oauth2client.file import Storage

from oauth2client.service_account import ServiceAccountCredentials

# Edit config.py file to edit gsheet name, credential info, selection range.
from config import SCOPES, CLIENT_SECRET_FILE, SHEET_NAME, SHEET_ID, SELECTION_RANGE

def get_credentials():
    # use creds to create a client to interact with the Google Drive API
    creds = ServiceAccountCredentials.from_json_keyfile_name(CLIENT_SECRET_FILE, SCOPES)
    return creds

def connect():
	credentials = get_credentials()
	http = credentials.authorize(httplib2.Http())
	discoveryUrl = ('https://sheets.googleapis.com/$discovery/rest?version=v4')
	service = discovery.build('sheets', 'v4', http=http,
		                      discoveryServiceUrl=discoveryUrl)
	return service

def read():
	service = connect()
	spreadsheetId = SHEET_ID
	rangeName = SELECTION_RANGE
	result = service.spreadsheets().values().get(
		spreadsheetId=SHEET_ID, range=rangeName).execute()
	return result

def write(valuesList):
	service = connect()
	values = [valuesList]
	body = {'values': values}
	result = service.spreadsheets().values().append(
		spreadsheetId=SHEET_ID, range=SELECTION_RANGE,
		valueInputOption='RAW', insertDataOption='INSERT_ROWS', body=body).execute()
	return result
