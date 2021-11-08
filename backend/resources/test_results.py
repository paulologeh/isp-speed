from flask import request
from pymongo import MongoClient
from flask_restful import Resource

# database
client = MongoClient('mongodb://127.0.0.1:27017/')
db = client['isp-speed']
collection = db['tests-data']


class TestResults(Resource):
    def __init__(self) -> None:
        super().__init__()

    def get(self) -> dict:
        try:
            data = list(collection.find({}, {"_id": 0}))
            return {'recordset': data}, 200
        except Exception as error:
            return 'Internal Server Error', 500
