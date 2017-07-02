requirements: 
	@sudo apt-get install python3
	@sudo apt-get install python3-pip
	@sudo apt-get install python3-virtualenv
	@virtualenv venv
	@venv/bin/pip install -r /home/raghav/myapp/app/requirements.txt
	@make config

config:
	@echo "************setup complete*****************"
	@echo "> Now add JSON credential file into app directory"
	@echo "> edit config.py"
	@echo "> then execute 'make run'"

run:
	venv/bin/python app.py
