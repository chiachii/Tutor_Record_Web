# -*- coding: utf-8 -*-

from flask import Flask, request, redirect, Response, make_response #新增 Response, make_response
from hashlib import sha256
from flask_jwt import JWT, jwt_required, current_identity


import sys
sys.path.append('..')
import server
import jwt #pip install pyjwt, jwt.com
import database

data = database

app = server.app


# 家教老師申請訂單
@app.route('/api/request_application', methods=['POST'])
@jwt_required()
def request_application():
  # 取得家教訂單資料 POST Body
  #根據資料庫，我們要新增 order_id, description, contact_method
  
  order_id = request.get_json()["order_id"]
  description = request.get_json()["description"]
  contact_method = request.get_json()["contact_method"]

  print(order_id)
  # 家教 JWD identity
  teacher_user_id = current_identity[0]

  # SQL 插入新的訂單
  sql = """
          INSERT INTO `wanted`.`application` 
        (`order_id` ,`teacher_user_id`, `description`, `contact_method`) 
        VALUES 
        (%s, %s, %s, %s);
        """

  params = (order_id, teacher_user_id, description, contact_method)

  # 執行 sql
  data.execute_sql(sql, params)

  # 回傳
  return "{ \"error\": false }"

"""
let req = await fetch("http://localhost:8080/auth", {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
    username: "happy02",
    password: "123456"
    })
});

let access_token = (await req.json()).access_token;

req = await fetch("http://localhost:8080/api/create_order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "JWT " + access_token
    },
    body: JSON.stringify({
      "title":"goooood",
      "description": "coooooool"
    })
});

await req.json()
"""

@app.route('/api/list_application_by_order_id', methods=['GET'])
@jwt_required()
def list_application_by_order_id():
  
  order_id = request.args.get('order_id')

  student_user_id = current_identity[0]

  # SQL 查詢應徵者 by order_id
  # 不是這個訂單家長就不能列出這個訂單的應徵者
  # (LEFT JOIN, RIGHT JOIN), INNER JOIN 1-1
  sql = """
          SELECT app.* FROM `wanted`.`application` app
          LEFT JOIN `wanted`.`orders` o ON app.order_id = o.id
          WHERE app.order_id = %s AND o.student_user_id = %s;
        """

  params = (order_id, student_user_id, )

  # 執行 sql
  return data.query_json(sql, params)
