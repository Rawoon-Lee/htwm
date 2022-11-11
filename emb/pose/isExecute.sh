CURRENT_PID=$(ps -ef | grep python3 | grep pose.py | awk '{print $2}')

if [ -z $CURRENT_PID ]; then
  echo "null"
else:
  echo "$CURRENT_PID"
fi