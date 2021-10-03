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

#teacher_fill_calss_record
@app.route('/api/teacher_fill_calss_record', methods=['POST'])
@jwt_required()
def teacher_fill_calss_record():
  
  order_id = request.get_json()["order_id"]
  teacher_comment = request.get_json()["teacher_comment"]
  teacher_class_note = request.get_json()["teacher_class_note"]
  teacher_rating = request.get_json()["teacher_rating"]

  # 家教 JWD identity
  teacher_user_id = current_identity[0]

  # 操作 API 身分過濾，一定要是本人才可以操作
  match_result = data.query_json("SELECT EXISTS(SELECT * FROM orders WHERE teacher_user_id=%s AND id=%s) AS is_match", (teacher_user_id, order_id, ))
  if not match_result['is_match']:
      return "{ \"error\": true, \"message\":\"you are not belongs to this order, cannot do any operation.\" }"


  # SQL 插入新的訂單
  sql = """
        INSERT INTO `wanted`.`class_record`(`order_id`, `class_filled_at`, `teacher_comment`, `teacher_class_note`, `teacher_rating`)
        VALUES (%s, NOW(), %s, %s, %s)
        """

  params = (order_id, teacher_comment, teacher_class_note, teacher_rating, )

  # 執行 sql
  data.execute_sql(sql, params)

  # 回傳
  return "{ \"error\": false }"

#student_fill_class_record
@app.route('/api/student_fill_class_record', methods=['POST'])
@jwt_required()
def student_fill_class_record():
  
  order_id = request.get_json()["order_id"]
  student_comment = request.get_json()["student_comment"]
  student_class_note = request.get_json()["student_class_note"]
  student_rating = request.get_json()["student_rating"]

  # 家教 JWD identity
  student_user_id = current_identity[0]

  # 操作 API 身分過濾，一定要是本人才可以操作
  match_result = data.query_json("SELECT EXISTS(SELECT * FROM orders WHERE student_user_id=%s AND id=%s) AS is_match", (student_user_id, order_id, ))
  if not match_result['is_match']:
      return "{ \"error\": true, \"message\":\"you are not belongs to this order, cannot do any operation.\" }"


  # SQL 插入新的訂單
  sql = """
        UPDATE `wanted`.`class_record`
        SET `student_comment`=%s, `student_class_note`=%s, `student_rating`=%s
        WHERE `id`=%s
        """

  params = (student_comment, student_class_note, student_rating, order_id, )

  # 執行 sql
  data.execute_sql(sql, params)

  # 回傳
  return "{ \"error\": false }"


@app.route('/api/my_class_record', methods=["GET"])
@jwt_required()
def my_class_record():
  sql = """
      SELECT * FROM orders o
      LEFT JOIN class_record cr ON cr.order_id = o.id
      WHERE o.student_user_id = %s OR o.teacher_user_id = %s;
  """

  params = (current_identity[0], current_identity[0], )

  return data.query_json(sql, params)