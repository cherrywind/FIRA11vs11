/*-------------useful functions--------------------------------------*/

function addLoadEvent(func) {
	var oldonload = window.onload;
	if(typeof window.onload != 'function') {
		window.onload = func;
	}
	else {
		window.onload = function() {
			oldonload;
			func();
		}
	}
}

/*将newElement元素插入到targetElement元素之后*/
function insertAfter(newElement,targetElement) {
	var parent = targetElement.parentNode;
	if(parent.lastChild == targetElement) {
		parent.appendChild(newElement);
	}
	else {
		insertBefore(newElement,targetElement.nextSibling);
	}
}

function addClass(element,classValue) {
	if(!element.className) {
		element.className = classValue;
	}
	else {
		newClassName = element.className;
		newClassName += " ";
		newClassName += classValue;
		element.className = newClassName;
	}
}


function highLightPage() {
	if(!document.getElementsByTagName) {
		return false;
	}
	var navs = document.getElementsByTagName('nav');
	if(navs.length == 0) {
		return false;
	}
	var links = navs[0].getElementsByTagName('a');
	if(links.length == 0) {
		return false;
	}
	for(var i = 0;i < links.length;i++) {
		var linkURL;
		linkURL = links[i].getAttribute('href');
		if(window.location.href.indexOf(linkURL) != -1) {
			links[i].className = "active";
		}
	}
}

/*showPic函数的改进版*/
function showPic(whichPic) {
	if(!document.getElementById("placeholderImage")) {//检查文档中id为placeholderImage的图片是否存在
		return false;
	}
	var source = whichPic.getAttribute("href");
	var placeholderImage = document.getElementById("placeholderImage");
	if(placeholderImage.nodeName != "IMG") {
		return false;
	}
	placeholderImage.setAttribute("src",source);
	
	if(document.getElementById("description")) {//如果没找到该描述段落，则忽略，只保证上面的图片可以正常替换就行，图片的描述找不到就不执行下面的代码
		var description = document.getElementById("description");
		var text = whichPic.getAttribute("title") ? whichPic.getAttribute("title") : "";//如果没有title属性，则替换文本显示空字符串
		if(description.firstChild.nodeType == 3) {
			description.firstChild.nodeValue = text;
		}
	}
	return true;	//返回true表示showPic函数执行成功
}
/*把文档中的事件处理函数分离出来——分离成以下的事件处理函数*/
function prepareGallary() {
	if(!document.getElementById) {
		return false;
	}
	if(!document.getElementsByTagName) {
		return false;
	}
	if(!document.getElementById("imageGallery")) {
		return false;
	}
	var imageGallery = document.getElementById("imageGallery");
	var links = imageGallery.getElementsByTagName("a");
	for(var i = 0;i < links.length;i++) {
		/*links[i].onclick = function() {
			showPic(this);
			return false;//取消当点击链接时浏览器打开新窗口的默认行为
		}*/
		/*上面注释掉的三行代码可以用下面的代码来改进，以使得可以平稳退化——如果showPic函数未执行成功，
		则不要取消浏览器对点击链接的默认行为，使得图片可以正常显示（只不过打开新窗口显示，用户体验
		稍微差了些，但是也要比点击链接没反应好得多），如果showPic函数返回true即执行成功，则!showPic为
		false，则会取消浏览器的默认行为，使得不会在新窗口打开图片*/
		links[i].onclick = function() {
			return !showPic(this);
			/*传递给showPic函数的参数是关键字this，它代表此时此刻和onclick事件相关联的那个元素，也就是说，
			this在这里代表links[i]，而links[i]又对应着links节点列表里的某个特定的节点。*/
		}
		/*上面的两行代码也可以写成：
		links[i].onclick = function() {
			if(showPic(this)) {
				return false;
			}
			else {
				return true;
			}
		}
		或者：
		links[i].onclick = function() {
			return showPic(this) ? false : true;
		}
		*/
	}
}

/*---------返回顶部动画------------------------------------*/

function backToTop() {
	var button = document.getElementsByClassName("backToTop-button")[0];
	// console.log(button);
	var timer = null;//定时器
	//页面可视区的高度,Chrome显示626，Firefox显示433,IE显示627，Opera显示613
	var clientHeight = document.documentElement.clientHeight;

	/***[注意]:以"/三个星/"包起来的代码按网上说的可以实现滚动中往下滚鼠标滚轮就可以使滚动条停下，
	 ***但是自己试了一下，只有在IE中可以，其他浏览器好像都必须在滚动条滚动的时候用鼠标拖拽住它
	 ***才可以，然而滚动条移动速度快，又很小，感觉难度挺大...
	 ***/
	
	var isAtTop = true;//是否在顶部
	window.onscroll = function () {//页面滚动时触发
		// console.log("页面滚动中...");

		/***/
		if(!isAtTop) {
			clearInterval(timer);
		}
		isAtTop = false;
		/***/

		var toTopDis = document.body.scrollTop || document.documentElement.scrollTop;
		if(toTopDis > clientHeight + 20) {
			button.style.display = 'block';
		}
		else {
			button.style.display = 'none';
		}
	}
	

	button.onclick = function() {
		// alert(button);
		// alert(clientHeight);

		//设置定时器
		timer = setInterval(function() {
			//获取滚动条到顶部的距离
			var toTopDis = document.body.scrollTop || document.documentElement.scrollTop;
			// console.log(toTopDis);

			/*[注意]原来是Math.floor(toTopDis / 13)，相对应的，下面
			 *是document.documentElement.scrollTop = toTopDis - speed，这样的话，滚动条会始终无法自动
			 *回到顶部（即toTopDis为0的状态），这样就不能满足clearInterval函数的执行条件，导致非得手动
			 *把滚动条拖动（或者用鼠标滚轮）到顶部，才能继续往下滑动浏览页面，否则用鼠标滚轮（或甚至
			 *强行往下拖动滚动条）往下滚动页面时，就一直滚不下去。
			 *改成Math.floor(-toTopDis / 13)之后（下面相应的改成toTopDis + speed），就可以解决这个bug。
			 *Why？
			 */
			var speed = Math.floor(-toTopDis / 8);
			// console.log(speed);

			//IE and Firefox
			if(document.documentElement.scrollTop) {
				document.documentElement.scrollTop = toTopDis + speed;
			}
			//Chrome and Opera
			else if(document.body.scrollTop) {
				document.body.scrollTop = toTopDis + speed;
			}

			/***/
			isAtTop = true;
			/***/

			if(toTopDis == 0) {
				clearInterval(timer);
			}
		},18);
	}
}


function loadEvents() {
	prepareGallary();
	highLightPage();
	backToTop();
}
// addLoadEvent(highLightPage);
// addLoadEvent(prepareGallary);
addLoadEvent(loadEvents);