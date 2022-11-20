# 15 point 모델
BODY_PARTS = { "Head": 0, "Neck": 1, "RShoulder": 2, "RElbow": 3, "RWrist": 4,
                "LShoulder": 5, "LElbow": 6, "LWrist": 7, "RHip": 8, "RKnee": 9,
                "RAnkle": 10, "LHip": 11, "LKnee": 12, "LAnkle": 13, "Chest": 14,
                "Background": 15 }

POSE_PAIRS = [ ["Head", "Neck"], ["Neck", "RShoulder"], ["RShoulder", "RElbow"],
                ["RElbow", "RWrist"], ["Neck", "LShoulder"], ["LShoulder", "LElbow"],
                ["LElbow", "LWrist"], ["Neck", "Chest"], ["Chest", "RHip"], ["RHip", "RKnee"],
                ["RKnee", "RAnkle"], ["Chest", "LHip"], ["LHip", "LKnee"], ["LKnee", "LAnkle"] ]

# 25 point 모델
BODY_PARTS2 = { "Nose" : 0,"Neck" : 1,"RShoulder" : 2,"RElbow" : 3,"RWrist" : 4,"LShoulder" : 5,
            "LElbow" : 6,"LWrist" : 7,"MidHip" : 8,"RHip" : 9,"RKnee" : 10,"RAnkle" : 11,"LHip" : 12,
            "LKnee" : 13,"LAnkle" : 14,"REye" : 15,"LEye" : 16,"REar" : 17,"LEar" : 18,"LBigToe" : 19,
            "LSmallToe" : 20,"LHeel" : 21,"RBigToe" : 22,"RSmallToe" : 23,"RHeel" : 24,"Background" : 25}

POSE_PAIRS2 = [ ["Nose", "Neck"], ["Neck", "RShoulder"], ["RShoulder", "RElbow"],
                ["RElbow", "RWrist"], ["Neck", "LShoulder"], ["LShoulder", "LElbow"],
                ["LElbow", "LWrist"], ["Neck", "MidHip"], ["MidHip", "RHip"], ["RHip", "RKnee"],
                ["RKnee", "RAnkle"], ["RAnkle", "RBigToe"], ["RBigToe", "RSmallToe"], ["RAnkle", "RHeel"],
                ["MidHip","LHip"], ["LHip","LKnee"],["LKnee","LAnkle"],["LAnkle","LHeel"],["LAnkle","LBigToe"],
                ["LBigToe","LSmallToe"],["Nose","REye"],["REye","REar"],["Nose","LEye"],["LEye","LEar"] ]
                
# 운동별 타입                
EXERCISE_TYPE = {
  "null": -1, "squat": 0, "kneeup": 1, "lateral": 2, "highkick": 3,
  "sideknee": 4, "pushup": 10, "mountain": 11, "crunch": 12, "flutterkick": 13,"bicycle": 14
}