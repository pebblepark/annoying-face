import cv2
import numpy as np
from flask import Flask, make_response, send_file
from flask_restx import Api, Resource
from werkzeug.datastructures import FileStorage

from api import get_annoying_face

app = Flask(__name__)
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
        args = request.parse_args()
        client = args['client']
        model = args['model']

        client_file_str = client.read()
        client_file = np.fromstring(client_file_str, np.uint8)
        client_img = cv2.imdecode(client_file, cv2.IMREAD_COLOR)

        model_file_str = model.read()
        model_file = np.fromstring(model_file_str, np.uint8)
        model_img = cv2.imdecode(model_file, cv2.IMREAD_COLOR)

        result = get_annoying_face(client_img, model_img)

        _, buffer = cv2.imencode('.png', result)
        response = make_response(buffer.tobytes())
        response.headers['Content-Type'] = 'image/png'

        return response

