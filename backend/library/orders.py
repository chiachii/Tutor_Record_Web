# -*- coding: utf-8 -*-
import jwt
from flask import Flask, request, Response, make_response, redirect
from hashlib import sha256

import requests
import json
import urllib.parse

import datetime

import time

from flask_jwt import JWT, jwt_required, current_identity

import sys
sys.path.append('..')
import server
import database as data

app = server.app

# list_order
@app.route('/api/list_order')
def get_orders():
  sql = """SELECT o.id, o.expire, o.title, o.description, s.current_grading_level FROM orders o
              LEFT JOIN student s ON o.student_user_id = s.id
              LEFT JOIN users u on u.id = o.student_user_id"""

  return data.query_json(sql)

# 建立訂單 (家長建立訂單)
@app.route('/api/create_order', methods=["POST"])
@jwt_required()
def create_order():
  title = request.get_json()["title"]
  content = request.get_json()["content"]
  
  sql = """
    INSERT INTO `wanted`.`orders` 
    (`student_user_id` ,`title`, `description`) 
    VALUES 
    (%s, %s, %s);
  """

  # current_identity #User -> (id, .....), current_identity 是陣列，第 0 個是 user_id
  params = (current_identity[0], title, content, )

  data.execute_sql(sql, params)

  return "{ \"error\" : false }"

# 接受訂單 (家長接受老師)
@app.route('/api/accept_order', methods=["POST"])
@jwt_required()
def accept_order():
  application_id = request.get_json()["application_id"]
  
  # 最後一個 student_user_id=%s <- 不是家長學生本人就不能接受
  sql = """
    UPDATE wanted.orders, (SELECT * FROM wanted.application WHERE id=%s) AS app
    SET orders.teacher_user_id = app.teacher_user_id
    WHERE orders.id = app.order_id AND orders.student_user_id=%s;
  """

  # current_identity #User -> (id, .....), current_identity 是陣列，第 0 個是 user_id
  params = (application_id, current_identity[0], )

  data.execute_sql(sql, params)

  return "{ \"error\" : false }"


# 列出家長自己發出的清單
@app.route('/api/my_created_order_list', methods=["GET"])
@jwt_required()
def my_created_order_list():

  sql = """
              SELECT * FROM orders o
              LEFT JOIN student s ON o.student_user_id = s.id
              LEFT JOIN users u ON u.id = s.user_id
              WHERE o.student_user_id = %s;
        """

  params = (current_identity[0], )

  return data.query_json(sql,params)

@app.route('/api/order_detail', methods=["GET"])
def order_detail():
  order_id = request.args.get('id')

  sql = """SELECT o.id, o.expire, o.title, o.description, s.current_grading_level, u.gender FROM orders o
              LEFT JOIN student s ON o.student_user_id = s.id
              LEFT JOIN users u on u.id = o.student_user_id
              WHERE o.id = %s
        """

  params = (order_id, )

  return data.query_json(sql, params)

@app.route('/api/my_application_order_list')
@jwt_required()
def my_application_order_list():

  sql = """
      SELECT o.* FROM application a
      LEFT JOIN orders o ON o.id = a.order_id
      WHERE a.teacher_user_id = %s
  """

  params = (current_identity[0], )

  return data.query_json(sql, params)