import cv2
from pathlib import Path
import ExerciseDef
import Point
import sys
from socket import *
import signal

class Exercise:
    def __init__(self, cameraNum, exerciseType):
        self.type = exerciseType
        self.cameraNum = cameraNum
        # 카메라 연결
        self.capture = cv2.VideoCapture(cameraNum) #카메라 정보 받아옴
        self.capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640) #카메라 속성 설정
        self.capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480) # width:너비, height: 높이

        # init
        # 상단 카메라
        if cameraNum == 0:
            self.inputWidth=240;
            self.inputHeight=320;
        # 하단 카메라
        else:
            self.inputWidth=320;
            self.inputHeight=240;
        self.inputScale=1.0/255;

        self.flag = 0

    def getPoints(self):
        #웹캠으로부터 영상 가져옴
        hasFrame, frame = self.capture.read()  
        
        # 카메라 회전
        if self.cameraNum == 0:
            dst = cv2.transpose(frame)
            frame = cv2.flip(dst, 0)
            frame=cv2.resize(frame,dsize=(240,320),interpolation=cv2.INTER_AREA)
        else:
            frame=cv2.resize(frame,dsize=(320,240),interpolation=cv2.INTER_AREA)
        
        #웹캠으로부터 영상을 가져올 수 없으면 웹캠 중지
        if not hasFrame:
            cv2.waitKey()
            return -1
        
        # 
        frameWidth = frame.shape[1]
        frameHeight = frame.shape[0]
        
        inpBlob = cv2.dnn.blobFromImage(frame, self.inputScale, (self.inputWidth, self.inputHeight), (0, 0, 0), swapRB=False, crop=False)
        
        imgb=cv2.dnn.imagesFromBlob(inpBlob)
        #cv2.imshow("motion",(imgb[0]*255.0).astype(np.uint8))
        
        # network에 넣어주기
        net.setInput(inpBlob)

        # 결과 받아오기
        output = net.forward()


        # 키포인트 검출시 이미지에 그려줌
        points = []
        for i in range(0,25):
            # 해당 신체부위 신뢰도 얻음.
            probMap = output[0, i, :, :]
        
            # global 최대값 찾기
            minVal, prob, minLoc, point = cv2.minMaxLoc(probMap)

            # 원래 이미지에 맞게 점 위치 변경
            x = (frameWidth * point[0]) / output.shape[3]
            y = (frameHeight * point[1]) / output.shape[2]

            # 키포인트 검출한 결과가 0.1보다 크면(검출한곳이 위 BODY_PARTS랑 맞는 부위면) points에 추가, 검출했는데 부위가 없으면 None으로    
            if prob > 0.1 :    
                cv2.circle(frame, (int(x), int(y)), 3, (0, 255, 255), thickness=-1, lineType=cv2.FILLED) # circle(그릴곳, 원의 중심, 반지름, 색)
                cv2.putText(frame, "{}".format(i), (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, lineType=cv2.LINE_AA)
                points.append((int(x), int(y)))
            else :
                points.append(None)
        
        # 각 POSE_PAIRS별로 선 그어줌 (머리 - 목, 목 - 왼쪽어깨, ...)
        for pair in Point.POSE_PAIRS2:
            partA = pair[0]             # Head
            partA = Point.BODY_PARTS2[partA]   # 0
            partB = pair[1]             # Neck
            partB = Point.BODY_PARTS2[partB]   # 1
            
            #partA와 partB 사이에 선을 그어줌 (cv2.line)
            if points[partA] and points[partB]:
                cv2.line(frame, points[partA], points[partB], (0, 255, 0), 2)
        cv2.imshow("Output-Keypoints",frame)
        
        return points

    def checkBeforeExercise(self,points,checkpoint):
        for idx in checkpoint:
            if(points[idx] is None):
                return 0
            x = points[idx][0]
            y = points[idx][1]
            if x == 0 and y == 0:
                return 0

    def end(self):
        self.capture.release()  #카메라 장치에서 받아온 메모리 해제

    def checkExercise(self, points):
        # 스쿼트
        if self.type == 0:
            checkPoint = []
            checkPoint.append(Point.BODY_PARTS2["MidHip"])
            checkPoint.append(Point.BODY_PARTS2["RHip"])
            checkPoint.append(Point.BODY_PARTS2["LHip"])
            checkPoint.append(Point.BODY_PARTS2["RKnee"])
            checkPoint.append(Point.BODY_PARTS2["LKnee"])

            if self.checkBeforeExercise(points,checkPoint) == 0:
                msg = '{"check" : "false"}'
                cSocket.send(msg.encode("utf-8"))
            else:
                msg = '{"check" : "true","count" : "null"}'
                cSocket.send(msg.encode("utf-8"))
                isUp = 'null'
                self.flag, isUp = ExerciseDef.countSquat(points,checkPoint,self.flag)
                if (isUp == 'up'):
                    msg = '{"check" : "true","count" : "up"}'
                    cSocket.send(msg.encode("utf-8"))
        
        # 무릎 높이 제자리 뛰기
        elif self.type == 1:
            checkPoint = []
            checkPoint.append(Point.BODY_PARTS2["MidHip"])
            checkPoint.append(Point.BODY_PARTS2["RHip"])
            checkPoint.append(Point.BODY_PARTS2["LHip"])
            checkPoint.append(Point.BODY_PARTS2["RKnee"])
            checkPoint.append(Point.BODY_PARTS2["LKnee"])

            if self.checkBeforeExercise(points,checkPoint) == 0:
                msg = '{"check" : "false"}'
                cSocket.send(msg.encode("utf-8"))
            else:
                msg = '{"check" : "true","count" : "null"}'
                cSocket.send(msg.encode("utf-8"))
                isUp = 'null'
                self.flag, isUp = ExerciseDef.countKneeUp(points,checkPoint, self.flag)
                if (isUp == 'up'):
                    msg = '{"check" : "true","count" : "up"}'
                    cSocket.send(msg.encode("utf-8"))

        # lateral Step and Reach
        # 손이 발과 맞닿는 경우 
        elif self.type == 2:
            checkPoint = []
            # flag가 0이면 오른손이 왼쪽 발목으로
            if self.flag == 0:
                checkPoint.append(Point.BODY_PARTS2["RWrist"])
                checkPoint.append(Point.BODY_PARTS2["LAnkle"])
            else:
                checkPoint.append(Point.BODY_PARTS2["LWrist"])
                checkPoint.append(Point.BODY_PARTS2["RAnkle"])

            if self.checkBeforeExercise(points,checkPoint) == 0:
                msg = '{"check" : "false"}'
                cSocket.send(msg.encode("utf-8"))
            else:
                msg = '{"check" : "true","count" : "null"}'
                cSocket.send(msg.encode("utf-8"))
                isUp = 'null'
                self.flag, isUp = ExerciseDef.countLateralStepReach(points, checkPoint, self.flag)
                if (isUp == 'up'):
                    msg = '{"check" : "true","count" : "up"}'
                    cSocket.send(msg.encode("utf-8"))

        # High Kick
        # 손이 발과 맞닿는 경우 
        elif self.type == 3:
            checkPoint = []
            # flag가 0이면 오른손이 왼쪽 발목으로
            if self.flag == 0:
                checkPoint.append(Point.BODY_PARTS2["RWrist"])
                checkPoint.append(Point.BODY_PARTS2["LBigToe"])
            elif self.flag == 1:
                checkPoint.append(Point.BODY_PARTS2["LWrist"])
                checkPoint.append(Point.BODY_PARTS2["RBigToe"])
        
            if self.checkBeforeExercise(points,checkPoint) == 0:
                msg = '{"check" : "false"}'
                cSocket.send(msg.encode("utf-8"))
            else:
                msg = '{"check" : "true","count" : "null"}'
                cSocket.send(msg.encode("utf-8"))
                isUp = 'null'
                self.flag, isUp = ExerciseDef.countHighKick(points,checkPoint,self.hflag)
                if (isUp == 'up'):
                    msg = '{"check" : "true","count" : "up"}'
                    cSocket.send(msg.encode("utf-8"))

        # Side KneeRaise
        elif self.type == 4:
            checkPoint = []
            # flag가 0이면 오른쪽 팔꿈치와 오른쪽 무릎이 닿는 경우
            if self.flag == 0:
                checkPoint.append(Point.BODY_PARTS2["RElbow"])
                checkPoint.append(Point.BODY_PARTS2["RKnee"])
            # flag가 1이면 왼쪽 팔꿈치와 왼쪽 무릎이 닿는 경우
            elif self.flag == 1:
                checkPoint.append(Point.BODY_PARTS2["LElbow"])
                checkPoint.append(Point.BODY_PARTS2["LKnee"])

            if self.checkBeforeExercise(points,checkPoint) == 0:
                msg = '{"check" : "false"}'
                cSocket.send(msg.encode("utf-8"))
            else:
                msg = '{"check" : "true","count" : "null"}'
                cSocket.send(msg.encode("utf-8"))
                isUp = 'null'
                self.flag, isUp = ExerciseDef.countSideKneeRaise(points,checkPoint,self.flag)
                if (isUp == 'up'):
                    msg = '{"check" : "true","count" : "up"}'
                    cSocket.send(msg.encode("utf-8"))
        # --------------------------------------------------------------------
        # DownCamera
        # Pushup
        elif self.type == 10:
            checkPoint = []
            checkPoint.append(Point.BODY_PARTS2["Neck"])
            checkPoint.append(Point.BODY_PARTS2["RElbow"])
            checkPoint.append(Point.BODY_PARTS2["LElbow"])

            if self.checkBeforeExercise(points,checkPoint) == 0:
                msg = '{"check" : "false"}'
                cSocket.send(msg.encode("utf-8"))
            else:
                msg = '{"check" : "true","count" : "null"}'
                cSocket.send(msg.encode("utf-8"))
                isUp = 'null'
                self.flag, isUp = ExerciseDef.countPushup(points,checkPoint,self.flag)
                if (isUp == 'up'):
                    msg = '{"check" : "true","count" : "up"}'
                    cSocket.send(msg.encode("utf-8"))
        # crunch
        elif self.type == 11 :
            checkPoint = []
            checkPoint.append(Point.BODY_PARTS2["RWrist"])
            checkPoint.append(Point.BODY_PARTS2["LWrist"])
            checkPoint.append(Point.BODY_PARTS2["RKnee"])
            checkPoint.append(Point.BODY_PARTS2["LKnee"])

            if self.checkBeforeExercise(points,checkPoint) == 0:
                msg = '{"check" : "false"}'
                cSocket.send(msg.encode("utf-8"))
            else:
                msg = '{"check" : "true","count" : "null"}'
                cSocket.send(msg.encode("utf-8"))
                isUp = 'null'
                self.flag, isUp = ExerciseDef.countCrunch(points,checkPoint,self.flag)
                if (isUp == 'up'):
                    msg = '{"check" : "true","count" : "up"}'
                    cSocket.send(msg.encode("utf-8"))
            
        # mountain
        elif self.type == 12 :
            checkPoint = []
            checkPoint.append(Point.BODY_PARTS2["MidHip"])
            checkPoint.append(Point.BODY_PARTS2["Neck"])
            checkPoint.append(Point.BODY_PARTS2["RKnee"])
            checkPoint.append(Point.BODY_PARTS2["LKnee"])

            if self.checkBeforeExercise(points,checkPoint) == 0:
                msg = '{"check" : "false"}'
                cSocket.send(msg.encode("utf-8"))
            else:
                msg = '{"check" : "true","count" : "null"}'
                cSocket.send(msg.encode("utf-8"))
                isUp = 'null'
                self.flag, isUp = ExerciseDef.countMountain(points,checkPoint,self.flag)
                if (isUp == 'up'):
                    msg = '{"check" : "true","count" : "up"}'
                    cSocket.send(msg.encode("utf-8"))
        # flutterkick
        elif self.type == 13 : 
            checkPoint = []
            checkPoint.append(Point.BODY_PARTS2["RAnkle"])
            checkPoint.append(Point.BODY_PARTS2["LAnkle"])
            
            if self.checkBeforeExercise(points,checkPoint) == 0:
                msg = '{"check" : "false"}'
                cSocket.send(msg.encode("utf-8"))
            else:
                msg = '{"check" : "true","count" : "null"}'
                cSocket.send(msg.encode("utf-8"))
                isUp = 'null'
                self.flag, isUp = ExerciseDef.countFlutterkick(points,checkPoint,self.flag)
                if (isUp == 'up'):
                    msg = '{"check" : "true","count" : "up"}'
                    cSocket.send(msg.encode("utf-8"))
        # bicycleCrunch
        elif self.type == 14 : 
            checkPoint = []
            checkPoint.append(Point.BODY_PARTS2["RElbow"])
            checkPoint.append(Point.BODY_PARTS2["LElbow"])
            checkPoint.append(Point.BODY_PARTS2["RKnee"])
            checkPoint.append(Point.BODY_PARTS2["LKnee"])
            
            if self.checkBeforeExercise(points,checkPoint) == 0:
                msg = '{"check" : "false"}'
                cSocket.send(msg.encode("utf-8"))
            else:
                msg = '{"check" : "true","count" : "null"}'
                cSocket.send(msg.encode("utf-8"))
                isUp = 'null'
                self.flag, isUp = ExerciseDef.countBicycleCrunch(points,checkPoint,self.flag)    
                if (isUp == 'up'):
                    msg = '{"check" : "true","count" : "up"}'
                    cSocket.send(msg.encode("utf-8"))

def exitHandler(signum,frame):
    global cSocket
    cSocket.send("/stop".encode("utf-8"))
    print("잘됨?")
    exit(0)

if __name__ == '__main__':
    global cSocket
    signal.signal(2, exitHandler)

    ip = "70.12.228.73"
    port = 9090
    cSocket = socket(AF_INET, SOCK_STREAM)
    cSocket.connect((ip,port))
    print("연결 완료")

    # MPII에서 각 파트 번호, 선으로 연결될 POSE_PAIRS
    BODY_PARTS = Point.BODY_PARTS2
    POSE_PAIRS = Point.POSE_PAIRS2
        
    # 각 파일 path
    BASE_DIR=Path(__file__).resolve().parent
    protoFile = "/home/hw/openpose/models/pose/body_25/pose_deploy.prototxt"
    weightsFile = "/home/hw/openpose/models/pose/body_25/pose_iter_584000.caffemodel"
    
    # 위의 path에 있는 network 모델 불러오기
    net = cv2.dnn.readNetFromCaffe(protoFile, weightsFile)

    #쿠다 사용 안하면 밑에 이미지 크기를 줄이는게 나을 것이다
    net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA) #벡엔드로 쿠다를 사용하여 속도향상을 꾀한다
    net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA) # 쿠다 디바이스에 계산 요청


    #카메라랑 연결
    exercise = Exercise(int(sys.argv[1]),int(sys.argv[2]))
    while cv2.waitKey(1) != 27:
        points = exercise.getPoints()
        if(points == -1): break
        exercise.checkExercise(points)
        
    exercise.end()
    cv2.destroyAllWindows() #모든 윈도우 창 닫음

