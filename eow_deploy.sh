#!/bin/bash
source ~/.bashrc
time=$(date +"%T")
day=$(date +"%D")
echo "$day:$time Running weekly deploy" 
echo "$day:$time Running weekly deploy" >> event.log
cd data-viewer
pwd
npm run deploy | cat >> ../deploy.log
cd ..
time=$(date +"%T")
day=$(date +"%D")
echo "$day:$time Completed weekly deploy"
echo "$day:$time Completed weekly deploy" >> event.log
