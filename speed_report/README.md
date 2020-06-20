# Scheduled Home Internet Speed Test

## Background
My ISP is pretty bad and I have complained about the lagging speeds for weeks.
The internet seems to experience times where it is just a deadband and then returns to normal function.
I made these bash scripts to run speed tests every hour to collect data about the speeds for a week. I want to see if I can get more information about the problem or to look for a trend.

## Implementation
* The bash script run_speed.sh performs the speed test and is run three times by generate_report.sh 
* The results are put in a spreadsheet speed_data.csv and the events logged in event.log
* See crontab for cronjob entry to run the scrip every hour.