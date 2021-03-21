#!/bin/bash
source ~/.bashrc
time=$(date +"%T")
day=$(date +"%D")
echo "$day:$time Attempting speed test" >> event.log
FILE=result.txt
speedtest-cli > $FILE

sleep 5

download=`grep 'Download' $FILE | awk '{print $2}'`
upload=`grep 'Upload' $FILE | awk '{print $2}'`
host=`grep 'Hosted' $FILE | awk '{print $3,$4,$5}'`
provider=`grep 'Testing from' $FILE | awk '{print $3}'`

if test -z $download; then
   echo "$day:$time Internet connection down" >> event.log
   exit 1
fi


echo $day,$time,$download,$upload,$host,$provider >> speed_data.csv
echo $day,$time,$download,$upload,$host,$provider
QUERY="INSERT INTO testresults(RecordTime,Download,Upload,Host,Provider)VALUES ('$day $time',$download,$upload,'$host','$provider');"
sqlcmd -U admin -P $AWSPASSWD -S $AWSRDS -d speedtest -Q "$QUERY"

if [ $? == 1 ]; then
  echo "$day:$time ERROR!: Database upload failed" >> event.log
  exit 1
fi
