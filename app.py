from tsv2json import tsv2json

from flask import Flask, jsonify
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

data_file = './terminologies/all.tsv'


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/terms')
def terms():
    terms = tsv2json(data_file)
    return jsonify(terms)
