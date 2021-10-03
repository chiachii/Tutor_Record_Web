# -*- coding: utf-8 -*-

from flask import Flask, request, redirect, Response, make_response #新增 Response, make_response
from hashlib import sha256
from flask_jwt import JWT, jwt_required, current_identity

import time
import jwt #pip install pyjwt, jwt.com

import urllib.parse
import requests
import json
import datetime

app = Flask(__name__)

# middleware 中間件
# 使用者送請求 -> [中間件] -> [系統 GET: line-29]
@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

def start():
    app.run(
    host="0.0.0.0",
    port=8080,
    debug=True
  )