const { app, BrowserWindow, ipcMain, powerMonitor } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const { execSync } = require('child_process')

let mainWindow
let isSleepMode

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 1920,
    // alwaysOnTop: true,
    // fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
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

app.on('ready', () => {
  createWindow()
  powerMonitor.on('suspend', () => {
    isSleepMode = true
    mainWindow.webContents.send('SLEEP', 'sleep')
    console.log('절전모드로 진입')
  })
  powerMonitor.on('resume', () => {
    isSleepMode = false
    mainWindow.webContents.send('WAKE', 'wake')
    console.log('절전모드 해제')
  })
})
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

///////////////////////////////////////// ipc 통신 //////////////////////////////////////////

// web으로부터 ipc 수신. 첫 인자는 무슨 이벤트를 받는지, 두번째인자는 요청 들으면 실행할 함수 정의
ipcMain.on('SLEEP', (event, arg) => {
  if (process.platform === 'win32') {
    execSync(`rundll32.exe powrprof.dll,SetSuspendState 0,1,0`)
  } else {
    // execSync('sudo pm-suspend')
    execSync('setterm -powersave powerdown')
  }
  isSleepMode = true
})
ipcMain.on('WAKE', (event, arg) => {
  if (isSleepMode) {
    execSync('setterm -powersave off')
    isSleepMode = false
  }
})

// web에게 ipc 송신
// mainWindow.webContents.send('send_test', 'main에서 보내는 메시지')
