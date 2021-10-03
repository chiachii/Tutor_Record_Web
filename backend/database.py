# -*- coding: utf-8 -*-

import mysql.connector
import urllib.parse
import requests
import json
import datetime

mydb = mysql.connector.connect(
  host="192.168.31.69",
  port=52000,
  user="root",
  password="rootroot",
  database="wanted"
)

# 處理 json datetime 問題: object of type datetime is not json serializable
def datetime_handler(x):
    if isinstance(x, datetime.datetime):
        return x.isoformat()
    raise TypeError("Unknown type")


def query_json(sql, params=()):
  #
  # 建立 cursor
  # https://stackoverflow.com/questions/42165218/python-mysql-connector-correct-way-to-retrive-a-row-as-dictionary
  mycursor = mydb.cursor(dictionary=True)


  mycursor.execute(sql, params)
  myresult = mycursor.fetchall()
  
  #dic = { t[0]: t[1:] for t in myresult }

  mycursor.close()

  # KEEP DO LIST ALL ORDER FROM DB
  return json.dumps(myresult, default=datetime_handler)#"{ \"success\":true }"


# 等弄 insert 再寫
def execute_sql(sql, params=()):
  mycursor = mydb.cursor()
  mycursor.execute(sql, params)
  mydb.commit()
  mycursor.close()
