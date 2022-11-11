
#Up Camera
def countSquat(body, checkPoint, flag):
    midHip = body[checkPoint[0]]
    rHip = body[checkPoint[1]]
    lHip = body[checkPoint[2]]
    rKnee = body[checkPoint[3]]
    lKnee = body[checkPoint[4]]

    # Hip이 Knee보다 작거나 같아지는 경우 카운트
    hipY = (midHip[1] + rHip[1] + lHip[1]) / 3
    kneeY  = (rKnee[1] + lKnee[1]) / 2
    if flag == 0 and (kneeY - hipY < 20):
        print("스쾃~ : 다운")
        flag = 1
        return flag,"null"
    
    elif flag == 1 and (kneeY - hipY > 40):
        print("스쾃~ : 업")
        flag = 0
        return flag,"up"
    
    return flag,"null"

def countKneeUp(body,checkPoint,flag):
    hipY = (body[checkPoint[0]][1] + body[checkPoint[1]][1] + body[checkPoint[2]][1]) / 3
    kneeY = min(body[checkPoint[3]][1] , body[checkPoint[4]][1])
    if flag == 0 and (hipY - kneeY > 30):
        print("Leg UP")
        flag = 1

    elif flag == 1 and (kneeY - hipY > 10):
        print("LEG Down")
        flag = 0
        return flag,"up"

    return flag,"null"

#오른손은 왼발목 왼손은 오른 발목
#RLRL WWAA
def countLateralStepReach(body,checkPoint, flag):
    wrist = body[checkPoint[0]]
    ankle = body[checkPoint[1]]

    plus = 100 # 가중치
    minAnklePoint = [ankle[0] - plus, ankle[1] - plus]
    maxAnklePoint = [ankle[0] + plus, ankle[1] + plus]

    # lateralFlag가 0이면 오른손이 왼쪽 발목으로
    if (flag == 0 
        and (wrist[0] >= minAnklePoint[0]) 
        and (wrist[0] <= maxAnklePoint[0]) 
        and (wrist[1] >= minAnklePoint[1]) 
        and (wrist[1] <= maxAnklePoint[1])):
        flag = 1

    # lateralFlag가 1이면 왼손이 오른쪽 발목으로
    elif (flag == 1 
        and (wrist[0] >= minAnklePoint[0]) 
        and (wrist[0] <= maxAnklePoint[0]) 
        and (wrist[1] >= minAnklePoint[1]) 
        and (wrist[1] <= maxAnklePoint[1])):
        flag = 0
        return flag,"up"
    return flag, "null"

def countHighKick(body,checkPoint,flag):
    wrist = body[checkPoint[0]]
    BigToe = body[checkPoint[1]]

    plus = 70 # 가중치
    minBigToePoint = [BigToe[0] - plus*1.5, BigToe[1] - plus*1.5]
    maxBigToePoint = [BigToe[0] + plus, BigToe[1] + plus]

    # highKickFlag가 0이면 오른손이 왼쪽 발로
    if((wrist[0] >= minBigToePoint[0]) 
        and (wrist[0] <= maxBigToePoint[0]) 
        and (wrist[1] >= minBigToePoint[1]) 
        and (wrist[1] <= maxBigToePoint[1])):
        if flag == 0: 
            flag = 1
            print("하나")
        # highKickFlag가 1이면 왼손이 오른쪽 발로
        elif flag == 1: 
            flag = 0
            print("둘")
            return flag,"up"
    return flag,"null"

def countSideKneeRaise(body,checkPoint,flag):
    elbow = body[checkPoint[0]]
    knee = body[checkPoint[1]]

    plus = 130
    minPoint = [knee[0] - plus, knee[1] - plus]
    maxPoint = [knee[0] + plus, knee[1] + plus]

    if ((elbow[0] >= minPoint[0]) 
        and (elbow[0] <= maxPoint[0]) 
        and (elbow[1] >= minPoint[1]) 
        and (elbow[1] <= maxPoint[1])):
        
        if flag == 0:
            print("오른쪽")
            flag = 1
        elif flag == 1:
            print("왼쪽")
            flag = 0
            return flag,"up"
    return flag,"null"

# ------------------------------------------------------------------------------------
# Lower Camera

# 10
def countPushup(body,checkPoint,flag):
    neckY = body[checkPoint[0]][1]
    elbowY = (body[checkPoint[1]][1] + body[checkPoint[2]][1]) / 2
    
    if flag == 0 and (neckY >= (elbowY - 10) ) : 
        print("pushup DOWN")
        flag = 1
    
    elif flag == 1 and ((elbowY - neckY) >= 10) :
        print("pushup UP")
        flag = 0
        return flag,"up"
        
    return flag,"null"


def isCrunch(wy, ky, wx, kx) :
    if ((wy<=(ky+30)) 
        and (wx<=(kx+70)) 
        and (wx>=(kx-70))) : 
        return 0
    elif (wy>=(ky-20)) : 
            return 1
    else : return 2

# 11
def countCrunch(body,checkPoint, flag):
    wristY = (body[checkPoint[0]][1] + body[checkPoint[1]][1]) / 2
    wristX = (body[checkPoint[0]][0] + body[checkPoint[1]][0]) / 2
    kneeY = (body[checkPoint[2]][1] + body[checkPoint[3]][1]) / 2
    kneeX = (body[checkPoint[2]][0] + body[checkPoint[3]][0]) / 2
    
    if flag == 0 and (isCrunch(wristY,kneeY,wristX,kneeX) == 0 ) :
        print("crunch UP")
        flag = 1
    
    elif flag == 1 and (isCrunch(wristY,kneeY,wristX,kneeX) == 1) :
        print("crunch DOWN")
        flag = 0
        return flag,"up"
        
    return flag,"null"
    
    # 12
def countMountain(body,checkPoint, flag):
    midhipX = body[checkPoint[0]][0]
    neck = body[checkPoint[1]]
    rKneeX = body[checkPoint[2]][0]
    lKneeX = body[checkPoint[3]][0]
    
    isRight = True
    
    if(midhipX < neck[0]) :
        # neck 이 오른쪽에 있을때 : knee - hip - neck - head
        pass
    else : 
        # neck 이 왼쪽에 있을 때 : head - neck - hip - knee
        isRight = False
    
    if flag == 0 :
        if ((isRight) and (midhipX < rKneeX)) :
            print("mountain Right")
            flag = 1
        elif ((not isRight) and (rKneeX < midhipX)) :
            print("mountain Right")
            flag = 1
    if flag == 1 :
        if ((isRight) and (midhipX < lKneeX)) :
            print("mountain Left")
            flag = 0
            return flag,"up"

        elif ((not isRight) and (lKneeX < midhipX)) :
            print("mountain Left")
            flag = 0
            return flag,"up"
    return flag,"null"

#13
def countFlutterkick(body,checkPoint, flag):
    rAnkleY = body[checkPoint[0]][1]
    lAnkleY = body[checkPoint[1]][1]
    
    if flag == 0 and (rAnkleY < (lAnkleY - 10)) :
        print("flutter kick RIGHT")
        flag = 1
    if flag == 1 and (lAnkleY < (rAnkleY - 10)):
        print("flutter kick LEFT")
        flag = 0
        return flag,"up"
    return flag,"null"

#14
def countBicycleCrunch(body,checkPoint,flag):
    rElbowX = body[checkPoint[0]][0]
    lElbowX = body[checkPoint[1]][0]
    rKneeX = body[checkPoint[2]][0]
    lKneeX = body[checkPoint[3]][0]
    
    plus = 50
    
    if flag == 0 and ((rKneeX-plus) <= lElbowX) and (lElbowX <= (rKneeX + plus)) :
        print("bicycle crunch RIGHT")
        flag = 1
    if flag == 1 and ((lKneeX-plus) <= rElbowX) and (rElbowX <= (lKneeX + plus)) :
        print("bicycle crunch LEFT")
        flag = 0
        return flag,"up"
    return flag,"null"