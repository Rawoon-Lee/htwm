CURRENT_PID=$(ps -ef | grep python3 | grep pose.py | awk '{print $2}')

echo "$CURRENT_PID"
if [ -z $CURRENT_PID ]; then
    echo "> 종료할 pid가 없습니다."
else
    echo "> kill -2 $CURRENT_PID"
    kill -2 $CURRENT_PID
fi