# Steps for generating google credential keys
- go to https://console.developers.google.com/apis/
- create a new project
- click `|+| Enable API`
- search for `sheets api`
- click on	`Google Sheets API` and enable it
- go to `Creadentials` section from sidebar
- click on small down arrow in `Create Credentials` button to open a drop down menu and choose `Service account key` option.
- choose Service account and give some account name
- choose type as `Project` > `Editor`
- set key type to JSON and click `create`
- save the key file to app directory
- Create google spreadsheet and give editor access to `client-email`, which is found inside `.json` file.
- Edit the config file accordingly.

# installation
- execute `make` in app directory

# execution
- execute `make run` in app directory
