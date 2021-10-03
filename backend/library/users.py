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

import sys
sys.path.append('..')
import server
import jwt #pip install pyjwt, jwt.com
import database

from library.email import send_email

mydb = database.mydb

app = server.app

app.config['SECRET_KEY'] = 'this is my securet for JWT'

# jwt token 驗證
class User(object):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

def authenticate(username, password):
    # 建立 cursor
    mycursor = mydb.cursor()
    # 判斷登入帳號密碼的情形
    sql = "SELECT * FROM users WHERE username = %s AND password = %s"
    adr = (username, sha256(password.encode('utf-8')).hexdigest(), )
    mycursor.execute(sql, adr)
    myresult = mycursor.fetchone()

    if myresult is not None:
      return User(myresult, username, 'ZERO')#{"id": 1, "username": username}

def identity(payload):
    return payload['identity']
  
jwt = JWT(app, authenticate, identity)

# JS 登入範例
"""
let req = await fetch("http://localhost:8080/auth", {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify({
    username: "happy02",
    password: "123456"
    })
});

await req.json()
"""

# 操作這個 API 的用法: 記得要加上 JWT 作為 Authorization 內文的開頭
"""
let req = await fetch("http://localhost:8080/jwt-test", { headers: {Authorization: "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MjE1MTI5NTMsImlhdCI6MTYyMTUxMjY1MywibmJmIjoxNjIxNTEyNjUzLCJpZGVudGl0eSI6MX0.T_JwmGF8omZmS-p3ld-U6TejQlcjRfyATB_uGrSVDFg"}});

await req.text()
"""
@app.route("/jwt-test")
@jwt_required()
def pjwttest():
  print("USER", current_identity)
  return "dsa"


@app.route('/')
def hello_world():
    print(mydb.cursor())
    return 'Hello, World!'

@app.route('/login', methods=["POST"])
def login():
  username = request.get_json()["username"]
  password = sha256(request.get_json()["password"].encode('utf-8')).hexdigest()

  # { password : 123 } 
  if password == None or username == None:
    return "{ \"isLogin\": false }"

  # 建立 cursor
  mycursor = mydb.cursor()
  # 判斷登入帳號密碼的情形
  sql = "SELECT EXISTS(SELECT * FROM users WHERE username = %s AND password = %s) as login;"
  adr = (username, password, )
  mycursor.execute(sql, adr)
  myresult = mycursor.fetchone()

  if myresult[0] == 1:
    resp = make_response("{ \"isLogin\": true }")
    encoded_jwt = jwt.encode({"username": username}, "Your-Secret-0x0x0x0", algorithm="HS256")
    resp.set_cookie(key='Authorization', value=encoded_jwt, expires=time.time()+6*60*1000)
    return resp
  else:
    return "{ \"isLogin\": false }"

@app.route('/logout', methods=["GET"])
def logout():
  resp = Response("{\"isLogin\":false}")
  resp.set_cookie(key='Authorization', value='', expires=0)
  return resp

@app.route('/valid_login_test', methods=["GET"])
def valid_login_test():
  authorization = request.cookies.get('Authorization')
  decode_jwt = jwt.decode(authorization, "Your-Secret-0x0x0x0", algorithms=["HS256"])
  print(decode_jwt)
  if authorization is not None:
    return 'OK'
  else:
    return 'Data is not exists'


@app.route('/register', methods=["POST"])
def register():
  fullname = request.get_json()["fullname"]
  age = request.get_json()["age"]
  phone = request.get_json()["phone"]
  email = request.get_json()["email"]
  username = request.get_json()["username"]
  password = request.get_json()["password"]
  account_type = request.get_json()["account_type"]
  current_grading_level = request.get_json()["current_grading_level"]
  professional = request.get_json()["professional"]
  password = sha256((password).encode("utf-8")).hexdigest()
  
  #if xxx == None or xxx == ""
  if fullname is None or age is None or phone is None or email is None or username is None or password is None:
    return "{ \"error\": \"請填寫所有的欄位\", \"success\":false }"

  # 建立 cursor
  mycursor = mydb.cursor()

  # 判斷是否有重複的使用者
  sql = "SELECT EXISTS(SELECT * FROM users WHERE username = %s) as already_exists"
  adr = (username, )
  mycursor.execute(sql, adr) 
  #(1, )
  user_exists_result = mycursor.fetchone()
  if user_exists_result[0] != 0:
    return "{\"error\":\"使用者已經存在\", \"success\":false}"
  else:
    # 存進資料庫
    sql = "INSERT INTO `wanted`.`users` (`fullname`, `age`, `phone`, `email`, `username`, `password`) VALUES(%s, %s, %s, %s, %s, %s)"
    adr = (fullname, age, phone, email, username, password, )
    mycursor.execute(sql, adr)
    mydb.commit()

    # 建立教師 or 學生資料
    if account_type == "teahcer":
      sql = "INSERT INTO `teacher` (`user_id`, `professional`) VALUES(%s, %s)"
      adr = (mycursor.lastrowid, professional, ) # mydb.insert_id() 會取得上一次 inserted id
      mycursor.execute(sql, adr)
      mydb.commit()
    else:
      sql = "INSERT INTO `student` (`user_id`, `current_grading_level`) VALUES(%s, %s)"
      adr = (mycursor.lastrowid, current_grading_level, ) # mydb.insert_id() 會取得上一次 inserted id
      mycursor.execute(sql, adr)
      mydb.commit()

    # 測試送 email
    send_email(to=email, subject="歡迎加入 XXX", text="歡迎加入!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" )

    return "{\"success\":true}"

#################### LINE LOGIN PART
@app.route('/auth/line', methods=["GET"])
def line_login_redirect():
  client_id = 1655726218
  redirect_url = urllib.parse.quote(u'https://44a535a652fa.ngrok.io/auth/line/auth'.encode('utf8'))
  state = 'abcde'
  scope = 'profile%20openid%20email'
  nonce = '09876xyz'
  url = 'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=%s&redirect_uri=%s&state=%s&scope=%s&nonce=%s' % (client_id, redirect_url, state, scope, nonce)
  return redirect(url, code=302)

@app.route('/auth/line/auth', methods=["GET"])
def line_login_auth():
  # https://developers.line.biz/en/docs/line-login/integrate-line-login/#making-an-authorization-request
  # https://developers.line.biz/en/reference/line-login/#verify-id-token
  # https://developers.line.biz/en/docs/line-login/integrate-line-login/#making-an-authorization-request
  # https://developers.line.biz/en/docs/line-login/integrate-line-login/#create-a-channel
  # https://developers.line.biz/console/channel/1655726218/basics
  print(request.get_json())

  # get grant access
  lga_header = { 'Content-Type': 'application/x-www-form-urlencoded' }
  lga_data = { 
    'grant_type' : 'authorization_code',
    'code' : request.args.get('code'),
    'redirect_uri' : 'https://44a535a652fa.ngrok.io/auth/line/auth',
    'client_id' : '1655726218',
    'client_secret' : '8fdddeff7d05c5179a161288d9217c0d'
  }
  line_grant_access = requests.post('https://api.line.me/oauth2/v2.1/token', data = lga_data, headers=lga_header)
  #b'{"access_token":"eyJhbGciOiJIUzI1NiJ9.Y2meHa2lcLcSnbJNP3Qb0W6Z1YmAKcyNvbA9dBO95bRGQjpaVUOYfJTWh5MfmR7ynixQI8_5VBJtfXJsWJospnRJWXHEtohpnLAkWfHnflvXLk5dyFv_J5Q2SeNTPvGTLtj53vxnoyDYAxpX_LXkSVXXHoedRklvuRlvLPhiE-w.CJxzq_yJKVn07mfHsYFR4YjBjmWXUE3wtnS7QuBw_Yg","token_type":"Bearer","refresh_token":"DByBdHbLzqg1W97CIalb","expires_in":2592000,"scope":"profile openid","id_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FjY2Vzcy5saW5lLm1lIiwic3ViIjoiVWVlZGNkYzZiMWMzOWQ4M2QxMDhkN2E0NTcxMDk5YjUyIiwiYXVkIjoiMTY1NTcyNjIxOCIsImV4cCI6MTYxNTA4ODQwNiwiaWF0IjoxNjE1MDg0ODA2LCJub25jZSI6IjA5ODc2eHl6IiwiYW1yIjpbImxpbmVzc28iXSwibmFtZSI6Ik1hYyBUYXlsb3IiLCJwaWN0dXJlIjoiaHR0cHM6Ly9wcm9maWxlLmxpbmUtc2Nkbi5uZXQvMGhGN3I1LWVkbEdSaFBURENIQzdobVQzTUpGM1U0WWg5UU4zb0VmbWhJUXk0eWRBbE5keU5mZldwUFQzMHlMMXRMY1g5VUsya1pGeWhuIn0.mSX5WF7v3BWeqJUUoBg6BSz3kBj01jWWMwG7wzgMwQA"}'
  lga = json.loads(line_grant_access.content)

  print(lga["id_token"])
  # req profile
  lgd_header = { 'Content-Type': 'application/x-www-form-urlencoded' }
  lgp_data = { 
    'id_token' : lga["id_token"],
    'client_id' : '1655726218'
  }
  line_get_profile = requests.post('https://api.line.me/oauth2/v2.1/verify', data = lgp_data, headers=lgd_header)
  print(line_get_profile.content)
  # 要取得 Email 要先記得做好申請
  # b'{"iss":"https://access.line.me","sub":"Ueedcdc6b1c39d83d108d7a4571099b52","aud":"1655726218","exp":1615088628,"iat":1615085028,"nonce":"09876xyz","amr":["linesso"],"name":"Mac Taylor","picture":"https://profile.line-scdn.net/0hF7r5-edlGRhPTDCHC7hmT3MJF3U4Yh9QN3oEfmhIQy4ydAlNdyNffWpPT30yL1tLcX9UK2kZFyhn"}'

  # 比較正確的資料，然後才跳轉 redirect
  return "OK"