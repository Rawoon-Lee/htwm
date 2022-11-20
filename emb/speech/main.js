const ADS1115 = require('ads1115')
const i2c = require('i2c-bus')
const express = require('express')
const sockjs = require('sockjs-client')
const stomp = require('stompjs')

const SockClient = new sockjs("https://k7a306.p.ssafy.io/api/socket");
const client = stomp.over(SockClient);

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.use(express.static('public'))

app.listen(port, () => {
  console.log('3000번 포트 실행중')
})


setTimeout(() => {
  i2c.openPromisified(1).then(async (bus) => {
    const ads1115 = await ADS1115(bus)
    ads1115.gain = 1

    while (1) {
      let value_1 = await ads1115.measure('0+GND')
      let value_2 = await ads1115.measure('1+GND')
      let value_3 = await ads1115.measure('2+GND')
      let value_4 = await ads1115.measure('3+GND')
      if (value_1 > 500 || value_2 > 500 || value_3 > 5000 || value_4 > 500) {
        console.log("hi")
        client.send(
          `/pub/streaming`,
          {},
          JSON.stringify({
            from: "helennaby",
            to: "helennaby",
            type: "knock",
            data: "knock",
          })
        );
      }
    }
  })
  },2000
)