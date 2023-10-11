# -*- coding: utf8 -*-
import json
import requests
import datetime
import time
import pymysql.cursors
import logging
import sys
import pytz

print('Start Transmission function')

logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger()
logger.setLevel(level=logging.INFO)

# The reverse push link for API gateway. API网关的反向推送链接
sendbackHost = "http://set-websocket.cb-common.apigateway.tencentyun.com/api-ibspekva"
# MySql database account information, you need to create a database and form in advance, the new two columns in the form: `ConnectionID`, `Date` 
# MySql数据库账号信息,需要提前创建好数据库和表单,表单中新建2列：`ConnectionID`, `Date`
Host = 'gz-cynosdbmysql-grp-mulqc6bb.sql.tencentcdb.com'
User = 'luao'
Password = 'A020218z'
Port = 21141
DB = u'SCF_Demo'
Table = u'ConnectionID_List'

# Changing the time zone to Beijing. 更改时区为北京时区
tz = pytz.timezone('Asia/Shanghai')

# 获取数据库连接
def getDB():
    connection = pymysql.connect(host=Host,
                                 user=User,
                                 password=Password,
                                 port=Port,
                                 db=DB,
                                 charset='utf8',
                                 cursorclass=pymysql.cursors.DictCursor)

    # 切换数据库
    sql = "use %s" % DB
    cursor = connection.cursor()
    cursor.execute(sql)

    return cursor, connection


def Get_ConnectionID_List():
    print('Start Get_ConnectionID_List function')
    connection = pymysql.connect(host=Host,
                                 user=User,
                                 password=Password,
                                 port=Port,
                                 db=DB,
                                 charset='utf8',
                                 cursorclass=pymysql.cursors.DictCursor)
    try:
        with connection.cursor() as cursor:
            sql = "use %s" % DB
            cursor.execute(sql)
            # Getting the current number of IDs. 获取当前已有的ID数
            sql = "select count(*) from %s" % Table
            cursor.execute(sql)
            result_count = cursor.fetchall()
            count = result_count[0]['count(*)']
            print("ConnectionID_Num is %s"%count)

            sql = "select * from %s" % Table
            cursor.execute(sql)
            result_id = cursor.fetchall()
            # print (result_id)
            connectionID_List = []
            for i in range(0,count):
                connectionID_List.append(result_id[i]['ConnectionID'])
            print ("connectionID_List is %s"%connectionID_List)
        # connection.commit()
    finally:
        connection.close()
    return connectionID_List


def send(connectionID, data):
    retmsg = {}
    retmsg['websocket'] = {}
    retmsg['websocket']['action'] = "data send"
    retmsg['websocket']['secConnectionID'] = connectionID
    retmsg['websocket']['dataType'] = 'text'
    retmsg['websocket']['data'] = data
    print("send %s to %s" % (json.dumps(data).decode('unicode-escape'), connectionID))
    requests.post(sendbackHost, json=retmsg)

def dispenseMessage(connectionID, data):

    status = "erro"
    erroMsg = "Null"
    title = "Null"
    result = "Null"
    sendID = connectionID

    if data == "HeartBeat":
        send(connectionID, "HeartBeat")
        print("回复%s的心跳包" % connectionID)
        return

    data = json.loads(data)

    if data['title'] == "getConnectID":
        status = "ok"
        result = connectionID
        title = "getConnectID"

    elif data['title'] == "send":
        status = "ok"
        sendID = data['data']['id']
        result = data['data']['data']
        title = "playerSend"

    return status, erroMsg, title, result, sendID


def main_handler(event, context):
    print("event is %s" % event)
    if 'websocket' not in event.keys():
        return {"errNo": 102, "errMsg": "not found web socket"}
    # for k in event['websocket'].keys():
    #     print(k+":"+event['websocket'][k])

    # Sending message to client. 发送消息给客户端
    connectionID_List=[]
    print("Start DB Request{%s}" % datetime.datetime.now(tz).strftime("%Y-%m-%d %H:%M:%S    "))
    connectionID_List = Get_ConnectionID_List()
    print("Finish DB Request {%s}" % datetime.datetime.now(tz).strftime("%Y-%m-%d %H:%M:%S"))
    # 当前连接的id
    connectionID = event['websocket']['secConnectionID']
    count = len(connectionID_List)

    # 收到的消息
    receivedMessage = event['websocket']['data']

    # 分发处理消息
    returnDate = dispenseMessage(connectionID, receivedMessage)
    if returnDate:
        status, erroMsg, title, result, sendID = returnDate
        send(sendID, json.dumps({"status":status,"errMsg":erroMsg,"title":title,"result":result}))

    return "send success"