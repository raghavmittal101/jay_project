# do not change
SCOPES = ['https://spreadsheets.google.com/feeds']

# this points to a json file location(relative or absolte path).
# go through README.md for more info
CLIENT_SECRET_FILE = '... .json'

# name of sheet to store data. Sheet must already exist.
SHEET_NAME = ' '

# sheet ID is part of URL while editing the sheet in browser.
SHEET_ID = ' '

# this specifies the region of sheet where data is to be written.
# you can also specify multiple sheets within single file.
# example `Sheet1!$A1:$YY`
# presently we are selecting full sheet1 as the region to write.
SELECTION_RANGE = '$A$1:$YY'
