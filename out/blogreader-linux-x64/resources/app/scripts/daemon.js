/*
 * BlogReader
 * 用更加美好的方法阅读博文
 * 2018年4月20日
 * 作者: dhdj
 */
 const {app, BrowserWindow, ipcMain} = require('electron')
 const Store = require('electron-store')
 const path = require('path')
 const url = require('url')

 const config = new Store()

 let addNewWindow = null
 let delOldWindow = null
 let mainWindow = null
 let mainWindowEvent

 function createAddNewWindow () {
  addNewWindow = new BrowserWindow({width: 600, height: 400, resizable: false, titleBarStyle: 'hidden'})

  addNewWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'addNewWindow.html'),
      protocol: 'file:',
      slashes: true
    }))

  //addNewWindow.webContents.openDevTools()

  addNewWindow.setMaximizable(false)
  addNewWindow.setFullScreenable(false)
/*
  addNewWindow.once('ready-to-show', () => {
    addNewWindow.show()
  })
*/
  addNewWindow.on('closed', () => {
      addNewWindow = null
    })
 }

 function createDelOldWindow () {
  delOldWindow = new BrowserWindow({width: 600, height: 400, resizable: false, titleBarStyle: 'hidden'})

  delOldWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'delOldWindow.html'),
      protocol: 'file:',
      slashes: true
    }))

  //delOldWindow.webContents.openDevTools()

  delOldWindow.setMaximizable(false)
  delOldWindow.setFullScreenable(false)

  delOldWindow.on('closed', () => {
      delOldWindow = null
    })
 }
 function createMainWindow () {
    mainWindow = new BrowserWindow({width: 1200, height: 800, titleBarStyle: 'hidden'})
  
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'mainWindow.html'),
      protocol: 'file:',
      slashes: true
    }))
  
    //mainWindow.webContents.openDevTools()
  
    mainWindow.on('closed', () => {
      mainWindow = null
    })
 }

 function startProgram(){
  createMainWindow()
  genNewConfig()
  /*
  if(config.get('opened') === undefined){
    createAddNewWindow()
  }
  */
 }

 function genNewConfig(){
  if(config.get('blogs') === undefined){
    var config_cache = {}
    config_cache["dhdj博客"]={"feedUrl":"https://blog.dypme.cn/feed/","searchUrl":"https://blog.dypme.cn/search/@/feed/rss2/"}
    config.set('blogs',config_cache)
  }
 }
 function isEmptyObject(e) {  
    var t;  
    for (t in e)  
        return !1;  
    return !0  
 }

 console.log(config.get("blogs"))
 //config.delete("blogs")
 //config.delete("opened")

 ipcMain.on('reload-addNewWindow', (event, arg) => {
  if(addNewWindow !== null){
    addNewWindow.close()
  }
  createAddNewWindow()
 })

 ipcMain.on('reload-delOldWindow', (event, arg) => {
  if(delOldWindow !== null){
    delOldWindow.close()
  }
  createDelOldWindow()
 })

 ipcMain.on('reload-mainWindow', (event, arg) => {
  if(mainWindow !== null){
    mainWindow.close()
  }
  createMainWindow()
 })

  ipcMain.on('WordpressRegister', (event, arg) => {
    var config_cache = {}
    //console.log(arg)
      config_cache=config.get('blogs')
      config_cache[arg["Rename"]]={"feedUrl":arg["Addr"]+"/feed/","searchUrl":arg["Addr"]+"/search/@/feed/rss2/"}
      config.set('blogs',config_cache)
      config.set('opened',true)
    addNewWindow.close()
    mainWindowEvent.sender.send('ReturnBlog', config.get('blogs'))
  })

  ipcMain.on('TypechoRegister', (event, arg) => {
    var config_cache = {}
    //console.log(arg)
      config_cache=config.get('blogs')
      config_cache[arg["Rename"]]={"feedUrl":arg["Addr"]+"/index.php/feed/","searchUrl":arg["Addr"]+"/index.php/feed/search/@/"}
      config.set('blogs',config_cache)
      config.set('opened',true)
    addNewWindow.close()
    mainWindowEvent.sender.send('ReturnBlog', config.get('blogs'))
  })

  ipcMain.on('OthersRegister', (event, arg) => {
    var config_cache = {}
    //console.log(arg)
      config_cache=config.get('blogs')
      config_cache[arg["Rename"]]={"feedUrl":arg["Addr"],"searchUrl":arg["Search"]}
      config.set('blogs',config_cache)
      config.set('opened',true)
    addNewWindow.close()
    mainWindowEvent.sender.send('ReturnBlog', config.get('blogs'))
  })

  ipcMain.on('GetBlogs', (event,arg) => {
    if(arg  == "mainWindow"){
        mainWindowEvent = event
    }
    event.sender.send('ReturnBlog', config.get('blogs'))
    if(config.get('opened') === undefined){
      event.sender.send('NeverOpened', 'triggered')
    }
  })

  ipcMain.on('DeleteBlog', (event,arg) => {
    //console.log(arg)
    var config_cache = {}
    config_cache=config.get('blogs')
    delete config_cache[arg]
    config.set('blogs',config_cache)
    if(isEmptyObject(config.get('blogs'))){
      config.set('blogs',{})
      config.delete('opened')
      //genNewConfig()
    }
    //console.log(mainWindowEvent)
    mainWindowEvent.sender.send('ReturnBlog', config.get('blogs'))
    event.sender.send('ReturnBlog', config.get('blogs'))
  })

 app.on('ready', startProgram)

 app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
 })

 app.on('activate', () => {
    if (mainWindow === null && addNewWindow === null) {
      startProgram()
    }
 })