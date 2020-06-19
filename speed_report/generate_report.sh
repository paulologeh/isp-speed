# run speed test 3 times
for i in {1..3}
do
./run_speed.sh
time=$(date +"%T")
done

