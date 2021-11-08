from datetime import datetime
from time import time
from speedtest import Speedtest
from pymongo import MongoClient


# database
client = MongoClient('mongodb://127.0.0.1:27017/')
db = client['isp-speed']
collection = db['tests-data']


def get_result() -> dict:
    servers = []

    threads = None
    s = Speedtest()
    s.get_servers(servers)
    s.get_best_server()
    s.download(threads=threads)
    s.upload(threads=threads)
    s.results.share()
    results_dict = s.results.dict()
    result = {
        'utc_time': time(),
        'download': results_dict['download'] * 1e-6,
        'upload': results_dict['upload'] * 1e-6,
        'host': results_dict['server']['sponsor'],
        'provider': results_dict['client']['isp']
    }
    return result


def upload_results(data: dict = None) -> None:
    if data is None:
        print(str(datetime.now()), 'data is None')
        return False

    collection.insert_one(data)

    return True


def save_locally(data: dict = None) -> None:
    with open('speed_data.csv', 'a+') as data_file:
        data_file.write(
            f'{data["utc_time"]},{data["download"]},{data["upload"]},{data["host"]},{data["provider"]}\n'
        )


if __name__ == '__main__':
    print(str(datetime.now()), 'running speed test')
    result = get_result()
    print(str(datetime.now()), result)
    save_locally(result)
    if upload_results(result):
        print(str(datetime.now()), 'Successfully uploaded')
    else:
        print(str(datetime.now()), 'Failed to upload speed test')
