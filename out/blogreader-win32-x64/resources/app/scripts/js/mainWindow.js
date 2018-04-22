 const {ipcRenderer} = require('electron')
 const {shell} = require('electron')

 const asyncMsgRestart = document.getElementById('restart-app')
 const mainTag = "#mainTag"
 const searchTag = "#search"
 const passageMax=20
 const base = new Base64()

 let blogs
 let currentBlog = {"feedUrl":"https://blog.dypme.cn/feed/","searchUrl":"https://blog.dypme.cn/search/@/feed/rss2/"}

 asyncMsgRestart.addEventListener('click', ()=>{
	ipcRenderer.send('reload-mainWindow', 'triggered')
 })

ipcRenderer.send('GetBlogs', 'mainWindow')

ipcRenderer.on('ReturnBlog', (event, arg) => {
		blogs=arg
  		renderBlogList()
})

ipcRenderer.on('NeverOpened', (event, arg) => {
	jQuery('#restart-app').append('及其子窗口(ID:addNewWindow)')	
  openAddNewWindow()
})

$("#sidebarTag").css("margin-top",document.getElementById("nav").offsetHeight);

window.onresize = function(){
	$("#sidebarTag").css("margin-top",document.getElementById("nav").offsetHeight);
}

function openAddNewWindow(){
	ipcRenderer.send('reload-addNewWindow', 'triggered')
}

function openDelOldWindow(){
	ipcRenderer.send('reload-delOldWindow', 'triggered')
}

function hereDoc(fn) {
    return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
}

function openLink(url){
	shell.openExternal(url)
}

function renderBlogList(){
	let html = ''
	jQuery('#blogList').text('')
	for(var blogName in blogs){
		html += '<li><a href="javascript:renderBlog(\''+blogName+'\',\''+base.encode(JSON.stringify(blogs[blogName]))+'\')"><i class="fa fa-globe"></i><span>'+blogName+'</span></a></li>'
	}
	jQuery('#blogList').append(html)
}

function renderBlog(blogName,blog){
	//console.log(blog)
	blog = JSON.parse(base.decode(blog))
	//console.log(blog)
	//console.log(blog["feedUrls"])
	currentBlog=blog
	currentBlog["Rename"]=blogName
	jQuery.getFeed({
		url: blog["feedUrl"],
		success: function(feed) {
			jQuery(mainTag).text('');
			jQuery("#title").text(feed.title);
			//console.log(feed)
			var html = '';
			for (var i = 0; i < feed.items.length && i <= passageMax; i++) {
				var item = feed.items[i];
				html += '<div class="card mainWindow-passage" style="width: 100%;"><div class="card-body"><h5 class="card-title">' + item.title + '</h5><h6 class="card-subtitle mb-2 text-muted">' + item.updated + '</h6><p class="card-text">' + item.description + '</p><a href="javascript:renderArticle(\''+blog["feedUrl"]+'\',\''+item.link+'\')" class="card-link">查看文章</a><a href="javascript:openLink(\''+item.link+'\')" class="card-link">在游览器里查看</a></div></div>'
			}
			jQuery(mainTag).append(html)
		}
	})
}

 function renderArticle(feedUrl,verifyLink){
 	jQuery("#title").text('加载中');
 	jQuery(mainTag).text('');
 	jQuery.getFeed({
		url: feedUrl,
		success: function(article) {
			jQuery("#title").text('');
			jQuery(mainTag).text('');
			//console.log(article)
			var html = '';
			for (var i = 0; i < article.items.length && i <= passageMax; i++) {
				var item = article.items[i];
				if(decodeURI(item.link)==decodeURI(verifyLink)){
					html='<div class="row justify-content-xs-center justify-content-sm-center justify-content-md-center justify-content-lg-center justify-content-xl-center"><div class="col-xs-12 col-sm-12 col-md-10 col-lg-8 col-xl-8"><div class="card mainWindow-passage" style="width: 100%;"><div class="card-body"><h5 class="card-title">' + item.title + '</h5><h6 class="card-subtitle mb-2 text-muted">' + item.updated + '</h6><div class="card-text passage-text" id="passage-text">' + item.content + '</div><a href="javascript:renderReview(\''+item.link+'\',\''+verifyLink+'\')" class="card-link">查看评论</a><a href="javascript:openLink(\''+item.link+'\')" class="card-link">在游览器里查看</a></div></div></div></div>'
				}
				//console.log(decodeURI(item.link))
				//console.log(decodeURI(verifyLink))
			}
			jQuery(mainTag).append(html)
			//changeImgSize()
		}
	})
 }

 function renderReview(url,VerifyLink){
 	jQuery("#title").text('加载中');
 	jQuery(mainTag).text('');
	jQuery.getFeed({
		url: url+'feed/',
		success: function(review) {
			jQuery("#title").text('');
			jQuery(mainTag).text('');
			console.log(review)
			var html = '';
			for (var i = 0; i < review.items.length && i <= passageMax; i++) {
				var item = review.items[i];
				html += '<div class="card mainWindow-passage" style="width: 100%;"><div class="card-body"><h5 class="card-title">' + item.title + '</h5><h6 class="card-subtitle mb-2 text-muted">' + item.updated + '</h6><p class="card-text">' + item.description + '</p><a href="javascript:renderArticle(\''+currentBlog["feedUrl"]+'\',\''+VerifyLink+'\')" class="card-link">返回文章</a><a href="javascript:renderBlog(\''+currentBlog["Rename"]+'\',\''+base.encode(JSON.stringify(currentBlog))+'\')" class="card-link">返回主页</a></div></div>'
			}
			jQuery(mainTag).append(html)
		}
	})
}

 function renderSearch() {
 	jQuery("#title").text('加载中');
 	jQuery(mainTag).text('');
	jQuery.getFeed({
		url: currentBlog["searchUrl"].replace('@',jQuery(searchTag).val()),
		success: function(result) {
			jQuery("#title").text('');
			jQuery(mainTag).text('');
			//console.log(result)
			var html = '';
			for (var i = 0; i < result.items.length && i <= passageMax; i++) {
				var item = result.items[i];
				html += '<div class="card mainWindow-passage" style="width: 100%;"><div class="card-body"><h5 class="card-title">' + item.title + '</h5><h6 class="card-subtitle mb-2 text-muted">' + item.updated + '</h6><p class="card-text">' + item.description + '</p><a href="javascript:renderArticle(\''+currentBlog["searchUrl"].replace('@',jQuery(searchTag).val())+'\',\''+item.link+'\')" class="card-link">查看文章</a><a href="javascript:openLink(\''+item.link+'\')" class="card-link">在游览器里查看</a></div></div>'
			}
			jQuery(mainTag).append(html)
		}
	})
 }
 function showHtml(func){
 	jQuery(mainTag).text('')
 	jQuery(mainTag).append(hereDoc(func))
 }

 //showHtml(selectionFormHtml)