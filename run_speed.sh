#!/bin/bash
source ~/.bashrc
time=$(date +"%T")
day=$(date +"%D")
echo "$day:$time Attempting speed test" >> event.log
FILE=result.txt
speedtest-cli > $FILE

if [ $? == 1 ]; then
  echo "$day:$time Internet connection down" >> event.log
  exit 1
fi

download=`grep 'Download' $FILE | awk '{print $2}'`
upload=`grep 'Upload' $FILE | awk '{print $2}'`
host=`grep 'Hosted' $FILE | awk '{print $3,$4,$5}'`
provider=`grep 'Testing from' $FILE | awk '{print $3}'`
echo $day,$time,$download,$upload,$host,$provider >> speed_data.csv
QUERY="INSERT INTO testresults(RecordTime,Download,Upload,Host,Provider)VALUES ('$day $time',$download,$upload,'$host','$provider');"
echo "$day:$time Speed test completed" >> event.log
sqlcmd -U admin -P $AWSPASSWD -S $AWSRDS -d speedtest -Q "$QUERY"

if [ $? == 1 ]; then
  echo "$day:$time ERROR!: Database upload failed" >> event.log
  exit 1
fi