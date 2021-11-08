from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from resources.test_results import TestResults


if __name__ == '__main__':
    app = Flask(__name__)
    app.config['CORS_HEADERS'] = 'Content-Type'
    CORS(app, resources={'/*': {'origins': ['.*']}})
    app.debug = True
    api = Api(app)

    # API Resource routing
    api.add_resource(TestResults, '/testresults/upload')

    # Run flask server
    app.run()
