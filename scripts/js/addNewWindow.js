 const {ipcRenderer} = require('electron')
 const {shell} = require('electron')

 const asyncMsgRestart = document.getElementById('restart-app')
 const mainTag = "#mainTag"

 asyncMsgRestart.addEventListener('click', ()=>{
	ipcRenderer.send('reload-addNewWindow', 'addNewWindow')
 })

function hereDoc(fn) {
    return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
}

 function selectionFormHtml(){/*
 	<div class="addNewWindow-choices container">
 	<h3 class="addNewWindow-title">要订阅的博客类型</h3>
<div class="btn-group" role="group" aria-label="选择博客类型">
  <button type="button" class="btn btn-secondary" onclick="javascript:showHtml(WordpressHtml)">Wordpress</button>
  <button type="button" class="btn btn-secondary" onclick="javascript:showHtml(TypechoHtml)">Typecho</button>
  <button type="button" class="btn btn-secondary" onclick="javascript:showHtml(OthersHtml)">其他/自定义</button>
</div>
</div>
 */}

 function WordpressHtml(){/*
 	<div class="addNewWindow-choices-selecting container">
 	<h3 class="addNewWindow-title-selecting">输入博客地址以及名称</h3>
 	<p class="addNewWindow-eg">例如https://blog.dypme.cn</p>
	<div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="博客地址" aria-label="博客地址" aria-describedby="basic-addon2" id="blogAddr">
  <div class="input-group-append">
    <span class="input-group-text" id="basic-addon2">/feed/</span>
  </div>
</div>
<div class="input-group mb-3">
<input type="text" class="form-control" placeholder="博客名称" aria-label="博客名称" aria-describedby="basic-addon2" id="blogRename">
</div>
<button type="button" class="btn btn-secondary" onclick="javascript:showHtml(selectionFormHtml)">返回</button>
<button type="button" class="btn btn-dark" onclick="javascript:WordpressRegister()">确定</button>
</div>
 */}

 function TypechoHtml(){/*
	<div class="addNewWindow-choices-selecting container">
 	<h3 class="addNewWindow-title-selecting">输入博客地址以及名称</h3>
 	<p class="addNewWindow-eg">例如https://blog.dypme.cn</p>
	<div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="博客地址" aria-label="博客地址" aria-describedby="basic-addon2" id="blogAddr">
  <div class="input-group-append">
    <span class="input-group-text" id="basic-addon2">/index.php/feed/</span>
  </div>
</div>
<div class="input-group mb-3">
<input type="text" class="form-control" placeholder="博客名称" aria-label="博客名称" aria-describedby="basic-addon2" id="blogRename">
</div>
<button type="button" class="btn btn-secondary" onclick="javascript:showHtml(selectionFormHtml)">返回</button>
<button type="button" class="btn btn-dark" onclick="javascript:TypechoRegister()">确定</button>
</div>
 */}

 function OthersHtml(){/*
	<div class="addNewWindow-choices-selecting container">
 	<h3 class="addNewWindow-title-selecting">输入RSS地址以及名称</h3>
 	<p class="addNewWindow-eg">例如https://blog.dypme.cn/feed/,搜索字符串请用@代替</p>
	<div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="RSS地址" aria-label="RSS地址" aria-describedby="basic-addon2" id="rssAddr">
  <input type="text" class="form-control" placeholder="RSS搜索地址" aria-label="RSS搜索地址" aria-describedby="basic-addon2" id="rssSearchAddr">
</div>
<div class="input-group mb-3">
<input type="text" class="form-control" placeholder="RSS名称" aria-label="RSS名称" aria-describedby="basic-addon2" id="rssRename">
</div>
<button type="button" class="btn btn-secondary" onclick="javascript:showHtml(selectionFormHtml)">返回</button>
<button type="button" class="btn btn-dark" onclick="javascript:OthersRegister()">确定</button>
</div>
 */}

 function WordpressRegister(){
 	if(jQuery("#blogAddr").val().length != 0 && jQuery("#blogRename").val().length != 0){
 		ipcRenderer.send('WordpressRegister', {"Addr":jQuery("#blogAddr").val(),"Rename":jQuery("#blogRename").val()})
 	}
 }

 function TypechoRegister(){
 	if(jQuery("#blogAddr").val().length != 0 && jQuery("#blogRename").val().length != 0){
 		ipcRenderer.send('TypechoRegister', {"Addr":jQuery("#blogAddr").val(),"Rename":jQuery("#blogRename").val()})
 	}
 }

 function OthersRegister(){
 	if(jQuery("#rssAddr").val().length != 0 && jQuery("#rssSearchAddr").val().length != 0 && jQuery("#rssRename").val().length != 0){
 		ipcRenderer.send('OthersRegister', {"Addr":jQuery("#rssAddr").val(),"Search":jQuery("#rssSearchAddr").val(),"Rename":jQuery("#rssRename").val()})
 	}
 }
 function showHtml(func){
 	jQuery(mainTag).text('')
 	jQuery(mainTag).append(hereDoc(func))
 }

 showHtml(selectionFormHtml)