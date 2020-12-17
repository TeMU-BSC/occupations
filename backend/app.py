import json

from brat2json import brat2json
from tsv2json import tsv2json

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)

terms_file = './data/terminologies/all.tsv'
tweets_directory = './data/final_nfkc_offsets_ok'


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/terms')
def terms():
    terms = tsv2json(terms_file, has_header=True)
    return jsonify(terms)


@app.route('/esco-terms')
def esco_terms():
    with open('./data/terminologies/esco.json') as f:
        esco_terms = json.load(f)
    return jsonify(esco_terms)


@app.route('/tweets')
def tweets():
    tweets = brat2json(tweets_directory)
    return jsonify(tweets)
