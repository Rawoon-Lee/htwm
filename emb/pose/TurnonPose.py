# 해당 파일은 몇번 카메라를 연결 시켜줄 것인지 지정해주는 파일
# RPI와 소켓 통신을 진행할 예정
# 해당 파일은 RPI to Jetson으로 정보를 받기만 할 예정
from socket import *
import json
import os
import Point
import time
from threading import Thread

def isExecute():
  nowExecute = os.popen('sh ./isExecute.sh')
  output = nowExecute.read()
  # 현재 작동중인 프로세스 있으면 종료
  if(output != 'null\n\n'):
    return 1
  else:
    return 0

# 작동 시키는 함수
def turnOnPose(data):
  obj = json.loads(data)

  cameraNum = 0
  typeNum = 0

  # 첫 운동
  if obj['name'] == 'null':
    nowExecute = os.popen('sh ./isExecute.sh')
    output = nowExecute.read()
    # 현재 작동중인 프로세스 있으면 종료
    if(output != 'null\n\n'):
      os.system('sh ./PoseKill.sh')
    
    temp = obj['next_name']
    if    (temp == 'squat' or 
          temp == 'kneeup' or 
          temp == 'lateral' or 
          temp == 'highkick' or
          temp == 'sideknee'):
            cameraNum = 0
    elif (temp == 'pushup' or
          temp == 'mountain' or
          temp == 'crunch' or
          temp == 'flutterkick' or
          temp == 'bicycle'):
            cameraNum = 1

    typeNum = Point.EXERCISE_TYPE[temp]
    print(cameraNum, typeNum)
    os.system('python3 ./pose.py {} {}'.format(cameraNum,typeNum))  

  # 첫 운동 이후 운동
  else:
    #운동이 시작될 때 -> 운동이 시작되면 아무 작업 안해주어도 된다. 이미 쉬는시간에 켜놨음
    #운동이 끝났을 때~
    print(obj)
    if obj['flag'] == 'end':
      #작동중인 프로세스가 있을 때 kill
      if(isExecute()):
        os.system('sh ./PoseKill.sh')
      
      #다음 운동 실행
      next_name = obj['next_name']
      typeNum = Point.EXERCISE_TYPE[next_name]
      if(typeNum < 10):
        cameraNum = 0
      else:
        cameraNum = 1

      # 다음 운동이 있을 경우에는 미리 켜준다.
      if(typeNum != -1):
        os.system('python3 ./pose.py {} {}'.format(cameraNum,typeNum))

def turnOffPose():
  # 스레드가 켜져 있으면 꺼짐 신호를 받을 때 끈다.
    if(isExecute()):
      os.system('sh ./PoseKill.sh')

if __name__ == '__main__':
  try:
    ip = "70.12.228.73"
    port = 9090
    cSocket = socket(AF_INET, SOCK_STREAM)
    cSocket.connect((ip,port))

    while True:   
      print('시작!')
      data = cSocket.recv(1024)
      #data = '''{"name" : "squat","flag" : "end","next_name" : "null"}'''
      print(data)
      obj = json.loads(data)
      if(obj['flag'] == 'end'):
        turnOffPose()

      turnOnThread = Thread(target = turnOnPose,args=(data,),daemon=True) 
      turnOnThread.start() 

  except:
    if(obj['flag'] == 'end'):
      turnOffPose()
    cSocket.close()
    print("에러 발생 종료")

  cSocket.close()


