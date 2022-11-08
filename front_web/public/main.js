const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 540,
    height: 960,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      devTools: isDev,
      contextIsolation: false,
      webSecurity: false,
    },
  })

  mainWindow.loadURL(isDev ? 'http://localhost:8080' : `file://${path.join(__dirname, '../dist/index.html')}`)

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }

  mainWindow.setResizable(true)
  mainWindow.on('closed', () => (mainWindow = null))
  mainWindow.focus()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// web 으로 ipc 수신. 첫 인자는 무슨 이벤트를 받는지, 두번째인자는 요청 들으면 실행할 함수 정의
ipcMain.on('send_test', (event, arg) => {
  console.log(event, arg, 'main에서 받음')
  // web으로 ipc 송신. 첫 인자는 무슨 이벤트명을 보낼지, 두번째는 메시지
  mainWindow.webContents.send('send_test', 'main에서 보내는 메시지')
})
