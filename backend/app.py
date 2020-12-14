from brat2json import brat2json
from tsv2json import tsv2json

from flask import Flask, jsonify
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

terms_file = './terminologies/all.tsv'
tweets_directory = './data/final_nfkc_offsets_ok'


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/terms')
def terms():
    terms = tsv2json(terms_file)
    return jsonify(terms)


@app.route('/tweets')
def tweets():
    tweets = brat2json(tweets_directory)
    return jsonify(tweets)
