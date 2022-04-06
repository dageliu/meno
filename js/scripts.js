(function(){

/* ユーザーエージェント判定
-------------------------------------------------------------------------------*/
$(function(){
	var u = window.navigator.userAgent.toLowerCase();
	var ua;
	if((u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
	|| u.indexOf("iphone") != -1
	|| u.indexOf("ipod") != -1
	|| (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
	|| (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
	|| u.indexOf("blackberry") != -1){
		document.documentElement.className = document.documentElement.className + ' sp';
	}else if((u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1)
	|| u.indexOf("ipad") != -1
	|| (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
	|| (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
	|| u.indexOf("kindle") != -1
	|| u.indexOf("silk") != -1
	|| u.indexOf("playbook") != -1){
		document.documentElement.className = document.documentElement.className + ' sp';
	}else{//PC
/*
		location.href = '../';
*/
	}
	if(u.indexOf('windows') != -1){
		document.documentElement.className = document.documentElement.className + ' win pc';
	}else if(u.indexOf('mac') != -1 && u.indexOf('iphone') == -1 && u.indexOf('ipod') == -1 && u.indexOf('ipad') == -1){
		document.documentElement.className = document.documentElement.className + ' mac pc';
	}

	if(u.indexOf('android') != -1 && u.indexOf('mobile') != -1){//Android用ビューポート設定
//		document.querySelector("[name=viewport]").setAttribute("content", "width=1136, initial-scale=1.0, user-scalable=yes, target-densitydpi=device-dpi");
	}else if(u.indexOf('iphone') != -1 || u.indexOf('ipod') != -1){//iPhone用ビューポート設定
//		document.querySelector("[name=viewport]").setAttribute("content", "width=1136");
	}

	if(u.indexOf('android') != -1 && u.indexOf('linux; u;') != -1 && u.indexOf('chrome') == -1){
		if(parseFloat(u.slice(u.indexOf("android") + 8)) <= 4.3 ){
			document.documentElement.className = document.documentElement.className + ' android43';
		}
	}
	if(u.indexOf('android') != -1 && u.indexOf('linux; u;') != -1 && u.indexOf('chrome') == -1){
		if(parseFloat(u.slice(u.indexOf("android") + 8)) <= 4.1 ){
			document.documentElement.className = document.documentElement.className + ' android41';
		}
	}
	if(u.indexOf('iphone os') != -1){
		document.documentElement.className = document.documentElement.className + ' iphone';
	}
});




/* 縦横判定
-------------------------------------------------------------------------------*/
$(function(){
	var defaultOrientation; // window.orientationが0または180の時に縦長であればtrue

	// 初期化処理
	if(window.addEventListener){
		window.addEventListener('load', function() {
			if('orientation' in window) {
				var o1 = (window.innerWidth < window.innerHeight);
				var o2 = (window.orientation % 180 == 0);
				defaultOrientation = (o1 && o2) || !(o1 || o2);
				checkOrientation();
			}
			// もしあれば、その他Webアプリの初期化処理
		}, false);
	}

	// iOSの場合とそれ以外とで画面回転時を判定するイベントを切り替える
	var event = navigator.userAgent.match(/(iPhone|iPod|iPad)/) ? 'orientationchange' : 'resize';
	// 画面回転時に向きをチェック
	if(window.addEventListener){
		window.addEventListener(event, checkOrientation, false);
	}

	function checkOrientation () {
		if('orientation' in window) {
			// defaultOrientationがtrueの場合、window.orientationが0か180の時は縦長
			// defaultOrientationがfalseの場合、window.orientationが-90か90の時は縦長
			var o = (window.orientation % 180 == 0);
			if((o && defaultOrientation) || !(o || defaultOrientation)) {
				// ここに縦長画面への切り替え処理を記述
				//console.log('portrait');
				resizeHeight();
/*
				if($('html.android43').length){
					document.querySelector("[name=viewport]").setAttribute("content", 'width=device-width, initial-scale=1.0');
				}
				$('#portrait').css({'display': 'block'});
				$('#landscape').css({'display': 'none'});
*/
			}
			else {
				// ここに横長画面への切り替え処理を記述
				//console.log('landscape');
				$('#modal').fadeOut();
				resizeHeight();
/*
				if($('html.android43').length){
					document.querySelector("[name=viewport]").setAttribute("content", 'width=1136, user-scalable=no, target-densitydpi=device-dpi');
				}
				$('#landscape').css({'display': 'block'});
				$('#portrait').css({'display': 'none'});
*/
			}
		}
	}

});



/*----------*/
})();


