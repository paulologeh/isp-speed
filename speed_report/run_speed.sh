#!/bin/bash
# check for internet connection
if ping -q -c 1 -W 1 google.com >/dev/null; then
  :
else
  exit 1
fi
FILE=result.txt
/usr/local/bin/speedtest-cli > $FILE
day=$(date +"%D")
time=$(date +"%T")
download=`grep 'Download' $FILE | awk '{print $2}'`
upload=`grep 'Upload' $FILE | awk '{print $2}'`
host=`grep 'Hosted' $FILE | awk '{print $3,$4,$5}'`
provider=`grep 'Testing from' $FILE | awk '{print $3}'`
echo $day,$time,$download,$upload,$host,$provider >> speed_data.csv