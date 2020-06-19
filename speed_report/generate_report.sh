# run speed test 3 times
for i in {1..3}
do
day=$(date +"%D")
time=$(date +"%T")
echo "$day:$time Running job $i">> event.log
./run_speed.sh
done
