import pymongo
import datetime

client = pymongo.MongoClient('mongodb://127.0.0.1:27017/')
db = client['isp-speed']
collection = db['tests-data']

count = 0
for line in open('speed_data.csv', 'r').readlines():
    if count == 0:
        count += 1
        continue

    data = line.strip().split(',')
    full_date = '{d} {t}'.format(d=data[0], t=data[1])
    posix_time = datetime.datetime.strptime(
        full_date, '%m/%d/%Y %H:%M:%S').timestamp()
    try:
        record = {
            'utc_time': posix_time,
            'download': float(data[2]) if data[2] else 0,
            'upload': float(data[3]) if data[3] else 0,
            'host': data[4],
            'provider': data[5],
        }
    except Exception as err:
        print(err)
        print(data)
    count += 1
    collection.insert_one(record)
