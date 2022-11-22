const SockClient = new SockJS("https://k7a306.p.ssafy.io/api/socket");
const client = Stomp.over(SockClient);

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = "ko-KR";
recognition.maxAlternatives = 10000;

let makeNewTextContent = function () {
  p = document.createElement("p");
  document.querySelector(".words").replaceChildren(p);
};

const sendMsg = (msg) => {
  client.send(
    `/pub/streaming`,
    {},
    JSON.stringify({
      from: 'helennaby',
      to: 'helennaby',
      type: 'speech',
      data: msg,
    })
  );
};

const startOrder = ['트윗', '트위터', '트윈', "거울아", "헬로", "hello", "hi", "Hello", "Hi","트윙", "트위", "스윙", "트립", "구입", "안녕"];
const routineStartOrders = ["루틴"];
const routineStopOrder = [
  "루틴 꺼 줘",
  "꺼줘",
  "꺼 줘",
  "종료",
  "스탑",
  "stop",
  "Stop",
];
const photoOrder = ["사진", "photo", "Photo", "찰칵"];
const callOrder = ["전화", "통화"];
const exOrder = ["운동", "리스트", "list", "List", "목록"];

let startFlag = false;
let routineCnt = 5; //루틴 개수 가져오기
let againCnt = 0;

let p = null;

recognition.start();

recognition.onstart = function () {
  console.log("스타트");
  let isVoice = false
  recognition.onspeechstart = function () {
    if(startFlag) isVoice = true
    console.log("음성인식스타트");
    makeNewTextContent(); // 음성 인식 시작시마다 새로운 문단을 추가한다.
  };
  if (startFlag) {
    setTimeout(() => {
      if (!isVoice) {
        startFlag = false;
        sendMsg('end');
      }
    }, 5000);
  }
};

recognition.onend = function () {
  recognition.onspeechend = function () {
    console.log("끝");
    p = document.querySelector(".words p");
    let texts = p.innerText;
    console.log(texts);

    let Order = null;
    if (startFlag) {
      //루틴 시작 명령어 찾기
      if (texts.search(routineStartOrders[0]) != -1) {
        for (let i = 1; i < 10; i++){
          if (texts.search(i) != -1) {
            Order = i
            break;
          }
        }
        if (texts.search("이번") != -1) Order = 2;
      }
      //루틴 종료 명령어 찾기
      for (let i = 0; i < routineStopOrder.length; i++) {
        if (texts.search(routineStopOrder[i]) != -1) {
          Order = "루틴 종료";
          break;
        }
      }
      //사진 명령어 찾기
      for (let i = 0; i < photoOrder.length; i++) {
        if (texts.search(photoOrder[i]) != -1) {
          Order = "사진";
          break;
        }
      }

      for (let i = 0; i < exOrder.length; i++) {
        if (texts.search(exOrder[i]) != -1) {
          Order = "리스트";
          break;
        }
      }

      //통화 명령어 찾기
      for (let i = 0; i < callOrder.length; i++) {
        if (texts.search(callOrder[i]) != -1) {
          /*
          if (texts.search("종료") != -1) {
            Order = "종료";
            break;
          } */
          Order = "종료"
          break
        }
      }

      //명령어 못 찾으면 다시
      if (Order == null) {
        console.log("다시 말씀해주세요.");
        againCnt++;
        if (againCnt > 5) {
          sendMsg("end")
          againCnt = 0
          startFlag = false;
        }
        else sendMsg("again")
      }
      else {
        console.log("성공!" + Order);
        client.send(
          `/pub/streaming`,
          {},
          JSON.stringify({
            from: "helennaby",
            to: "helennaby",
            type: "order",
            data: Order,
          })
        );
        if(Order !== "리스트") startFlag = false;
      }
    }

    if (!startFlag && startOrder.some((start) => texts.search(start) != -1)) {
      startFlag = true;
      sendMsg("start")
      console.log("명령어를 말해주세요.");
    }
  };
  recognition.start();
};

recognition.onresult = function (e) {
  let texts = Array.from(e.results)
    .map((results) => results[0].transcript)
    .join("");

  texts.replace(/느낌표|강조|뿅/gi, "❗️");

  p.textContent = texts;
  let str = p.innerText;
  if(startFlag)
    sendMsg(str)
};

/*
const SockClient = new SockJS('https://k7a306.p.ssafy.io/api/socket');
const client = Stomp.over(SockClient);

const sendMsg = (msg) => {
  client.send(
    `/pub/streaming`,
    {},
    JSON.stringify({
      from: 'b',
      to: 'b',
      type: 'speech',
      data: msg,
    })
  );
};

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'ko-KR';

const startOrder = ['트윗', '트위터'];
const routineStartOrders = ['번', '번 루틴'];
const routineStopOrder = [
  '루틴 꺼 줘',
  '꺼줘',
  '꺼 줘',
  '종료',
  '스탑',
  'stop',
  'Stop',
];
const photoOrder = ['사진', 'photo', 'Photo', '찰칵'];
const callOrder = ['전화', '통화'];

let startFlag = false;
let routineCnt = 5; //루틴 개수 가져오기
let p = null;

const makeNewTextContent = function () {
  p = document.createElement('p');
  document.querySelector('.words').replaceChildren(p);
};

recognition.onstart = function () {};
recognition.onspeechstart = function () {
  console.log('음성인식스타트');
  makeNewTextContent();
};

recognition.onspeechend = function () {};
recognition.onend = function () {
  recognition.start();
};

recognition.onresult = function (e) {
  let texts = Array.from(e.results)
    .map((results) => results[0].transcript)
    .join('');

  if (texts[texts.length - 1] === '.') {
    texts = texts.slice(0, texts.length - 1);
  }
  p.textContent = texts;

  let Order = null;
  if (!startFlag && startOrder.some((start) => texts.search(start) != -1)) {
    startFlag = true;
    console.log('명령어를 말해주세요.');
    sendMsg('start');
    setTimeout(() => {
      if (startFlag) {
        startFlag = false;
        sendMsg('end');
      }
    }, 12000);
  }

  if (startFlag) {
    //루틴 시작 명령어 찾기
    let chk = false;
    for (let i = 0; i < routineStartOrders.length; i++) {
      for (let j = 1; j <= routineCnt; j++) {
        if (texts.search(j + routineStartOrders[i]) != -1) {
          Order = j + '번 루틴';
          chk = true;
          break;
        }
      }
      if (chk) break;
    }

    //루틴 종료 명령어 찾기
    for (let i = 0; i < routineStopOrder.length; i++) {
      if (texts.search(routineStopOrder[i]) != -1) {
        Order = '루틴 종료';
        chk = true;
        break;
      }
    }

    //사진 명령어 찾기
    for (let i = 0; i < photoOrder.length; i++) {
      if (texts.search(photoOrder[i]) != -1) {
        Order = '사진';
        break;
      }
    }

    //통화 명령어 찾기
    for (let i = 0; i < callOrder.length; i++) {
      if (texts.search(callOrder[i]) != -1) {
        if (texts.search('종료') != -1) {
          Order = '종료';
          chk = true;
          break;
        }
      }
      if (chk) break;
    }

    //명령어 못 찾으면 다시
    if (Order == null) {
      sendMsg('again');
      console.log('다시 말씀해주세요.');
    } else {
      console.log('성공!' + Order);
      client.send(
        `/pub/streaming`,
        {},
        JSON.stringify({
          from: "b",
          to: "b",
          type: "order",
          data: Order,
        })
      );
      startFlag = false;
    }
  }
};

recognition.start();

*/
