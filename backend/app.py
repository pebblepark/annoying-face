# -- coding: utf-8 --
import os

import cv2
import numpy as np
from flask import Flask, Response, json, make_response
from flask_cors import CORS
from flask_restx import Api, Resource
from werkzeug.datastructures import FileStorage

from api import get_annoying_face

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'https://pebblepark.github.io'])
swaggerApi = Api(app, version='1.0', title='Annoying-Face API', description='Swagger Docs', doc='/api-docs')

@app.route("/")
def hello():
    return "Hello World!"

request = swaggerApi.parser()
request.add_argument('client', type=FileStorage, location='files', required=True)
request.add_argument('model', type=FileStorage, location='files', required=True)

@swaggerApi.route('/api')
class Api(Resource):
    @swaggerApi.expect(request)
    def post(self):
        """얼굴 합성"""
        args = request.parse_args()
        client = args['client']
        model = args['model']

        client_file_str = client.read()
        client_file = np.fromstring(client_file_str, np.uint8)
        client_img = cv2.imdecode(client_file, cv2.IMREAD_COLOR)

        model_file_str = model.read()
        model_file = np.fromstring(model_file_str, np.uint8)
        model_img = cv2.imdecode(model_file, cv2.IMREAD_COLOR)

        try:
            result = get_annoying_face(client_img, model_img)
        except Exception as e:
            return Response(json.dumps({'message': str(e)}), status = 500)

        _, buffer = cv2.imencode('.png', result)
        response = make_response(buffer.tobytes())
        response.headers['Content-Type'] = 'image/png'

        return response

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)