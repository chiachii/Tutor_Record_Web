# -*- coding: utf-8 -*-
import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

from flask_jwt import JWT, jwt_required, current_identity

import sys
sys.path.append('..')
import server
import jwt #pip install pyjwt, jwt.com
import database

import uuid

app = server.app
data = database

# 你要回上一層先建目錄，否則會出錯
# Windows C:\Users\XXX\Desktop
# Linux /home/XXX/Desktop
# Windows (JP) C:¥Users¥blogcat¥mycode.ipynb
UPLOAD_FOLDER = os.path.commonprefix(['uploads']) # path join #'./uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# flask 指定上傳目錄
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
  # MYPHOTO (x)
  # MYPHOTO.my.aa.jpg
  # MYPHOTO.my.aa                 JPG -> jpg, jpg -> jpg
  return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



# nexmo config
import vonage
client = vonage.Client(key="e156f2dc", secret="FS36oul5TUYwAYCS")
verify = vonage.Verify(client)


# localhost:8080/uploads
@app.route('/uploads', methods=['GET', 'POST'])
@jwt_required()
def upload_file():
  # 上傳用
  if request.method == 'POST':
    # 'file' <- html form 'name'
    # <input type="text" name="password" />
    if 'file' not in request.files:
      flash('No file part')
      return redirect(request.url)
    
    file = request.files['file']
    if file.filename == '':
      flash('No selected file')
      return redirect(request.url)

    if file and allowed_file(file.filename):
      # filename = secure_filename(file.filename) # secured filename
      # https://medium.com/pgsql-tw/uuid-%E6%81%B0%E5%B7%A7%E6%B2%92%E6%9C%89%E9%87%8D%E8%A6%86-4f42932d8ebf
      extension = os.path.splitext(file.filename)[1]
      filename = str(uuid.uuid4()) + extension # 'XXX-XXX-XXX-XXX.jpg'
      file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))


      # put file in database.
      sql_insert = """
        INSERT INTO verification_files (`file_url`, `teacher_id`) 
          VALUES (%s, %s);
      """
      params = (filename, current_identity[0], )

      # 執行 sql
      data.execute_sql(sql_insert, params)

      return '{"filename":"%s"}' % filename

  if request.method == 'GET':
    return '''
      <!DOCTYPE html>
      <html>
        <head>
          <title>請上傳檔案</title>
        </head>
        <body>
          <h1>請上傳檔案</h1>
          <form method="POST" enctype="multipart/form-data">
            <input type="file" name="file" />
            <input type="submit" value="上傳" />
          </form>
        </body>
      </html>
    '''



@app.route('/request_review_proof_documetns', methods=["POST"])
@jwt_required()
def request_review_proof_documetns():

  sql = """
    INSERT INTO teacher_verification(`teacher_id`) VALUES(%s);
  """

  params = (current_identity[0], )

  data.execute_sql(sql, params)

  return '{ "success": true }'

# 前端按下要驗證的按鈕
@app.route('/request_phone_numer_verification', methods=["POST"])
@jwt_required()
def request_phone_numer_verification():

  # required to send data.
  phone_number = request.get_json()["phone_number"]
  user_id = current_identity[0]


  response = verify.start_verification(number=phone_number, brand="COOL")

  if response["status"] == "0":
      print("Started verification request_id is %s" % (response["request_id"]))
      request_id = response["request_id"]

      sql = """
        INSERT INTO phone_verification (`phone_number`, `nexmo_request_id`, `user_id`) VALUES (%s, %s, %s);
      """

      params = (phone_number, request_id, user_id, )

      # data.execute_sql(sql, params)

      return '{"success":true, "nexmo_request_id":"%s"}' % response["request_id"]

  else:
      print("Error: %s" % response["error_text"])

      return '{"success":false, "reason":"%s"}' % response["error_text"]

@app.route('/verify_phone_number', methods=["POST"])
@jwt_required()
def verify_phone_number():

  # required to send data.
  request_id = request.get_json()["request_id"]
  code = request.get_json()["code"]
  user_id = current_identity[0]

  sql = """
    SELECT * FROM `phone_verification`
  """

  response = verify.check(request_id, code=code)

  if response["status"] == "0":
      print("Verification successful, event_id is %s" % (response["event_id"]))

      sql = """
        UPDATE `phone_verification` SET `verified_at` = NOW() WHERE `nexmo_request_id` = %s AND user_id = %s;
      """

      # params = (request_id, user_id, )

      print(response)

      return '{"success":true, "event_id":"%s"}' % response["event_id"]
  else:
      print("Error: %s" % response["error_text"])

      return '{"success":false, "reason":"%s"}' % response["error_text"]

@app.route('/is_phone_number_verified', methods=["POST"])
@jwt_required()
def is_phone_number_verified():

  user_id = current_identity[0]

  sql = """
    SELECT EXISTS( SELECT * FROM `phone_verification` WHERE user_id = %s AND verified_at IS NOT NULL ) as IS_VERIFIED;
  """

  # != : postgreSQL
  # general: IS NOT NULL (for compare null)
  # value: 1 <> 1   == false, 1 <> 2 == true

  params = (user_id, )

  result = data.query_json(sql, params)

  return '{"success":true, "is_verified": %s }' % result.IS_VERIFIED


@app.route('/verification_status', methods=["GET"])
@jwt_required()
def verification_status():

  sql = """
    SELECT EXISTS(SELECT * FROM wanted.teacher_verification WHERE reviewed_at IS NOT NULL AND review_status = 'PASSED' AND teacher_id = %s) as IS_VERIFIED;
  """

  params = (current_identity[0], )

  result = data.query_json(sql, params)
  
  return '{"success":true, "is_verified": %s }' % result.IS_VERIFIED

# 8aab8ed5b63c418fb8e91fa44167da5b
# Error: Concurrent verifications to the same number are not allowed