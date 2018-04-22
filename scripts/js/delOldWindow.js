 const {ipcRenderer} = require('electron')
 const {shell} = require('electron')

 const asyncMsgRestart = document.getElementById('restart-app')
 const mainTag = "#mainTag"

 let blogs

 asyncMsgRestart.addEventListener('click', ()=>{
	ipcRenderer.send('reload-delOldWindow', 'delOldWindow')
 })

ipcRenderer.send('GetBlogs', 'delOldWindow')

ipcRenderer.on('ReturnBlog', (event, arg) => {
  blogs=arg
  renderBlogList()
})

ipcRenderer.on('NeverOpened', (event, arg) => {

})

function hereDoc(fn) {
    return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
}

function renderBlogList(){
	let html = ''
	jQuery(mainTag).text('')
	for(var blogName in blogs){
		html += '<button type="button" class="btn btn-secondary" onclick="javascript:deleteBlog(\''+blogName+'\')">删除'+blogName+'</button>'
	}
	jQuery(mainTag).append(html)
}

function deleteBlog(blogName){
	//console.log(blogName)
	ipcRenderer.send('DeleteBlog', blogName)
}