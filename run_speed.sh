#!/bin/bash
source ~/.bashrc
time=$(date +"%T")
day=$(date +"%D")
echo "$day:$time Attempting speed test" >> event.log
# check for internet connection
if ping -q -c 1 -W 1 google.com >/dev/null; then
  :
else
	echo "$day:$time Internet connection down" >> event.log
  exit 1 
fi
FILE=result.txt
speedtest-cli > $FILE
download=`grep 'Download' $FILE | awk '{print $2}'`
upload=`grep 'Upload' $FILE | awk '{print $2}'`
host=`grep 'Hosted' $FILE | awk '{print $3,$4,$5}'`
provider=`grep 'Testing from' $FILE | awk '{print $3}'`
echo $day,$time,$download,$upload,$host,$provider >> speed_data.csv
echo "INSERT INTO testresults(RecordTime,Download,Upload,Host,Provider)VALUES ('$day $time',$download,$upload,'$host','$provider');" > update_database.sql
echo "$day:$time Speed test completed" >> event.log
sqlcmd -U admin -P $AWSPASSWD -S $AWSRDS -d speedtest -i update_database.sql
cp speed_data.csv ./data-viewer/public/speed_data.csv