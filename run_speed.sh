#!/bin/bash
source ~/.bashrc
time=$(date +"%T")
day=$(date +"%D")
echo "$day:$time Attempting speed test" >> event.log
# check for internet connection
if ping -q -c 1 -W 1 google.co.uk >/dev/null; then
  :
else
	echo "$day:$time Internet connection down" >> event.log
	echo "$day,$time,0,0,none,none" >> speed_data.csv
  cp speed_data.csv data-viewer
  exit 1 
fi
FILE=result.txt
speedtest-cli > $FILE
download=`grep 'Download' $FILE | awk '{print $2}'`
upload=`grep 'Upload' $FILE | awk '{print $2}'`
host=`grep 'Hosted' $FILE | awk '{print $3,$4,$5}'`
provider=`grep 'Testing from' $FILE | awk '{print $3}'`
echo $day,$time,$download,$upload,$host,$provider >> speed_data.csv
echo "$day:$time Speed test completed" >> event.log
cp speed_data.csv ./data-viewer/public/speed_data.csv