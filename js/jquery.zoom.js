/*
 * jQuery.zoom.js
 * Copyright (c) 2010 KEYTON.CO,Ltd.
 * Dual licensed under MIT and GPL.
 * Date: 2010-6-15
 * @author Hayashi Naoki
 * @version 1.0.0
 * http://www.keyton-co.jp/
 */

var zoom_e, dPosX, dPosY, mPosX, mPosY;
var istop = true;
var curFrame = 0;
var isLoadingImg = false;

jQuery(function ($) {
  $.fn.zoom = function (options) {
    var addHTML =
      '<div class="jZoom"><div class="zTerritory"></div><div class="zImage"></div></div>';
    var setting = {
      toppage: true,
      par: 10,
      initial: 100, // %
      min: 100, // % >100
      max: 500, // %
      fix: false, // ture or false
      width: 300, // pixel
      height: 300, // pixel
    };
    var mark_par = "%";
    options = options || {};
    $.extend(setting, options);

    return $(this).each(function (i) {
      var C_MAX_HEIGHT,
        C_MAX_WIDTH,
        canvas_height,
        canvas_width,
        jZoom,
        territory,
        obj;
      zoom_e = setting.initial;
      var el = $(this);
      var mx,
        my,
        busy = false;
      var S_source = el.clone().removeClass();
      var S_asr = el.width() / el.height();
      if (setting.fix) {
        canvas_height = setting.height;
        canvas_width = setting.width;
      } else {
        canvas_height = el.height();
        canvas_width = el.width();
      }
      jZoom = el.hide().after(addHTML).next();
      territory = jZoom.find(".zTerritory");
      mask = $(".mask");
      obj = jZoom.find(".zImage");
      jZoom.width(canvas_width).height(canvas_height);

      var default_asr = canvas_width / canvas_height;

      function zoom(img, e, x, y) {
        if (busy) return false;
        busy = true;
        e = e < setting.min ? setting.min : e > setting.max ? setting.max : e;
        x = x || canvas_width * 0.5;
        y = y || canvas_height * 0.5;
        setPos(img, e, x, y);
        //setScaleBar(img,e);
        busy = false;
        return e;
      }
      function setPos(img, e, x, y) {
        var e_par, par, i_height, i_width, i_top, i_left;
        e_par = e / 100;
        diff_par = 1 - e_par;
        par = (canvas_width * e_par) / img.outerWidth();
        i_height = canvas_height * e_par;
        i_width = canvas_width * e_par;
        i_top = par * (img.position().top - y) + y;
        i_left = par * (img.position().left - x) + x;
        if (e == setting.min) {
          if (i_top < 0) {
            i_top = 0;
          } else if (i_top + C_MAX_HEIGHT * e_par > C_MAX_HEIGHT) {
            i_top = C_MAX_HEIGHT * diff_par;
          }
          if (i_left < 0) {
            i_left = 0;
          } else if (i_left + C_MAX_WIDTH * e_par > C_MAX_WIDTH) {
            i_left = C_MAX_WIDTH * diff_par;
          }
        } else {
          if (i_top >= 0) {
            i_top = 0;
          } else if (i_top + C_MAX_HEIGHT * e_par < C_MAX_HEIGHT) {
            i_top = C_MAX_HEIGHT * diff_par;
          }
          if (i_left >= 0) {
            i_left = 0;
          } else if (i_left + C_MAX_WIDTH * e_par < C_MAX_WIDTH) {
            i_left = C_MAX_WIDTH * diff_par;
          }
        }
        img.css({
          top: i_top,
          left: i_left,
          height: i_height,
          width: i_width,
        });
        territory.css({
          left: canvas_width * diff_par,
          top: canvas_height * diff_par,
          width: canvas_width * (2 * e_par - 1),
          height: canvas_height * (2 * e_par - 1),
        });
        return true;
      }
      function drawImg(obj, zoom_asr, src) {
        var o_width,
          o_height,
          d_top,
          d_left,
          d_width,
          d_height,
          f_top,
          f_left,
          asr_diff;
        o_height = (canvas_height * setting.initial) / 100;
        o_width = (canvas_width * setting.initial) / 100;
        f_top = (canvas_height - o_height) / 2;
        f_left = (canvas_width - o_width) / 2;
        if (default_asr > zoom_asr) {
          // 左右が余る
          asr_diff = zoom_asr / default_asr;
          C_MAX_HEIGHT = canvas_height;
          C_MAX_WIDTH = canvas_height * zoom_asr;
          d_top = 0;
          d_left = 50 - 50 * asr_diff + mark_par;
          d_height = 100 + mark_par;
          d_width = "auto";
        } else if (default_asr < zoom_asr) {
          // 上下が余る
          asr_diff = default_asr / zoom_asr;
          C_MAX_HEIGHT = canvas_width / zoom_asr;
          C_MAX_WIDTH = canvas_width;
          d_top = 50 - 50 * asr_diff + mark_par;
          d_left = 0;
          d_height = "auto";
          d_width = 100 + mark_par;
        } else {
          C_MAX_WIDTH = canvas_width;
          C_MAX_HEIGHT = canvas_height;
          d_top = 0;
          d_left = 0;
          d_height = 100 + mark_par;
          d_width = 100 + mark_par;
        }
        var source = $('<img src="' + src + '" />');
        source.css({
          top: d_top,
          left: d_left,
          height: d_height,
          width: d_width,
        });
        obj
          .width(o_width)
          .height(o_height)
          .css({
            top: f_top,
            left: f_left,
          })
          .html(source);
      }

      var dStartX, dStartY, mStartX, mStartY;
      function toSecondpage(x, y, to, z) {
        var f = 0;
        if (to) {
          f = to;
        } else {
          f = calcFrame(x, y);
		}
        curFrame = f;
        var src = "img/main/" + f + ".jpg";
        $(".arw_left,.arw_right,.arw_top,.arw_bottom").fadeOut();
        loadImg(src, () => {
          drawImg(obj, S_asr, src);
          zoom_e = z || 100;
          zoom(obj, zoom_e + 20);
          setting.toppage = false;
		  $('.thumb').show();
		  $('.thumb .ts div').removeClass('active').eq(curFrame-1).addClass('active')
          istop = false;
        });
      }
      function toToppage() {
        $(".arw_left,.arw_right,.arw_top,.arw_bottom").fadeOut();
        drawImg(obj, S_asr, "img/main/main.jpg?111");
        zoom_e = 500;
        zoom(obj, zoom_e);
        setBacktopPos();
        setting.toppage = true;
		istop = true;
		$('.thumb').hide();
      }

      function calcFrame(mx, my) {
        var x = -1 * parseInt($(".zImage").css("left"), 10) + mx;
        var y = -1 * parseInt($(".zImage").css("top"), 10) + my;
        var w = parseInt($(".zImage").css("width"), 10) / 5;
        var h = parseInt($(".zImage").css("height"), 10) / 5;
        console.log(x, y, w, h);
        var nx = parseInt(x / w);
        var ny = parseInt(y / h);
        console.log(nx, ny, ny * 5 + nx + 1);
        return ny * 5 + nx + 1;
      }
      function setBacktopPos() {
        console.log("from", curFrame, " to main");
        var x = (curFrame - 1) % 5;
        var y = parseInt((curFrame - 1) / 5);
        var w = parseInt($(".zImage").css("width"), 10) / 5;
        var h = parseInt($(".zImage").css("height"), 10) / 5;
        $(".zImage").css({ left: -x * w + "px", top: -y * h + "px" });
      }
      function loadImg(src, callback) {
        isLoadingImg = true;
        mask.fadeIn();
        var img = new Image();
        img.onload = function () {
          img.onload = null;
          isLoadingImg = false;
          mask.fadeOut();
          callback(src);
        };
        img.src = src;
      }
      var hasLeft = true;
      var hasRight = true;
      var hasTop = true;
      var hasBottom = true;
      function arrowFade() {
        if (istop) {
          $(".arw_left,.arw_right,.arw_top,.arw_bottom").fadeOut();
          return;
        }
        var left = -1 * parseInt($(".zImage").css("left"), 10);
        var width = parseInt($(".zImage").css("width"), 10);
        hasLeft = true;
        hasRight = true;
        hasTop = true;
        hasBottom = true;
        if (parseInt(curFrame / 5) == 0) {
          hasTop = false;
        }
        if (parseInt(curFrame / 5) == 4 || parseInt(curFrame / 5) == 5) {
          hasBottom = false;
        }
        if (curFrame % 5 == 1) {
          hasLeft = false;
        }
        if (curFrame % 5 == 0) {
          hasRight = false;
        }
        console.log("curFrame:", curFrame);
        console.log(
          "top:",
          hasTop,
          " right:",
          hasRight,
          " left:",
          hasLeft,
          " bottom:",
          hasBottom
        );

        if (left <= 1 && hasLeft) {
          $(".arw_left").fadeIn();
        } else {
          $(".arw_left").fadeOut();
        }
        left = width - left;
        if (left <= canvas_width + 10 && hasRight) {
          $(".arw_right").fadeIn();
        } else {
          $(".arw_right").fadeOut();
        }

        var top = -1 * parseInt($(".zImage").css("top"), 10);
        var height = parseInt($(".zImage").css("height"), 10);
        if (top <= 1 && hasTop) {
          $(".arw_top").fadeIn();
        } else {
          $(".arw_top").fadeOut();
        }
        top = height - top;
        console.log("h", top, canvas_height);
        if (top <= canvas_height + 10 && hasBottom) {
          $(".arw_bottom").fadeIn();
        } else {
          $(".arw_bottom").fadeOut();
        }
      }
      function calcToFrame(dir) {
        var res = 0;
        switch (dir) {
          case "left":
            res = curFrame - 1;
            break;
          case "right":
            res = curFrame + 1;
            break;
          case "top":
            res = curFrame - 5;
            break;
          case "bottom":
            res = curFrame + 5;
            break;
        }
        console.log(curFrame, " to ", res);
        return res;
      }
      function linkNext() {
        var left = -1 * parseInt($(".zImage").css("left"), 10);
        var top = -1 * parseInt($(".zImage").css("top"), 10);
        var width = parseInt($(".zImage").css("width"), 10);
        var height = parseInt($(".zImage").css("height"), 10);

        if (hasLeft) {
          if ((left <= 1 && dPosX <= -2) || (left <= 1 && mPosX <= -20)) {
            toSecondpage(0, 0, calcToFrame("left"), zoom_e);
          }
        }
        var left2 = width - left;
        if (hasRight) {
          if (
            (left2 <= canvas_width + 10 && dPosX >= 2) ||
            (left2 <= 1000 && mPosX >= 20)
          ) {
            toSecondpage(0, 0, calcToFrame("right"), zoom_e);
          }
        }

        if (hasTop) {
          if ((top <= 1 && dPosY <= -2) || (top <= 1 && mPosY <= -20)) {
            toSecondpage(0, 0, calcToFrame("top"), zoom_e);
          }
        }
        var top2 = height - top;
        if (hasBottom) {
          if (
            (top2 <= canvas_height + 10 && dPosY >= 2) ||
            (top2 <= canvas_height + 10 && mPosY >= 20)
          ) {
            toSecondpage(0, 0, calcToFrame("bottom"), zoom_e);
          }
        }
      }
      obj.draggable({
        start: function (e, ui) {
          $(e.target).addClass("drag");
          dStartX = ui.position.left;
          dStartY = ui.position.top;
          mStartX = e.screenX;
          mStartY = e.screenY;
          return true;
        },
        stop: function (e, ui) {
          $(e.target).removeClass("drag");
          dPosX = dStartX - ui.position.left;
          dPosY = dStartY - ui.position.top;
          mPosX = mStartX - e.screenX;
          mPosY = mStartY - e.screenY;
          //console.log(dPosX + ' ' + dPosY + '   ' + mPosX + ' ' + mPosY);
          if (!setting.toppage) {
            linkNext();
          }
          return true;
        },
        drag: function (e, ui) {
          if (!setting.toppage) {
            arrowFade();
          }
        },
        containment: territory,
      });
      jZoom
        .mousemove(function (e) {
          my = parseInt(e.pageY - $(e.currentTarget).offset().top);
          mx = parseInt(e.pageX - $(e.currentTarget).offset().left);
        })
        .mousewheel(function (e, delta) {
          if (isLoadingImg) return;
          zoom_e += setting.par * delta;
          if (setting.toppage) {
            if (zoom_e >= 520) {
              toSecondpage(mx, my);
              return;
            }
          } else {
            if (zoom_e <= 100) {
              toToppage();
              return;
            }
          }
          zoom_e = zoom($(e.currentTarget).find(".zImage"), zoom_e, mx, my);
          if (!istop) {
            arrowFade();
          }
          return false;
        });
      function touchInit() {
        document.addEventListener("touchstart", touchHandlerStart, false);
        document.addEventListener("touchmove", touchHandlerMove, false);
        document.addEventListener("touchend", touchHandlerEnd, false);
      }
      var scaleStart;
      var scaleMove;
      function touchHandlerStart(event) {
        if ($("html.android41").length) {
          if (event.touches[1].pageX) {
            event.preventDefault();
          }
        }
        scaleStart = Math.sqrt(
          Math.pow(event.touches[1].pageX - event.touches[0].pageX, 2) +
            Math.pow(event.touches[1].pageY - event.touches[0].pageY, 2)
        );
      }
      function touchHandlerMove(event) {
        if ($("html.android41").length) {
          event.preventDefault();
        } else if ($("html.iphone").length) {
          if (event.touches[1].pageX) {
            event.preventDefault();
          }
        }
        var x = Math.sqrt(
          Math.pow((event.touches[1].pageX - event.touches[0].pageX) / 2, 2)
        );
        var y = Math.sqrt(
          Math.pow((event.touches[1].pageY - event.touches[0].pageY) / 2, 2)
        );

        scaleMove = Math.sqrt(
          Math.pow(event.touches[1].pageX - event.touches[0].pageX, 2) +
            Math.pow(event.touches[1].pageY - event.touches[0].pageY, 2)
        );
        var scale = scaleMove - scaleStart;
        scale = scale * 0.05;

        zoom_e += setting.par * scale;
        if (setting.toppage) {
          $("h1").text(zoom_e);
          if (zoom_e >= 500) {
            toSecondpage(x || 0, y || 0);
            return;
          }
        } else {
          if (zoom_e <= 100) {
            toToppage();
            return;
          }
        }
        zoom_e = zoom(
          $(".zImage"),
          zoom_e,
          event.touches[0].pageX,
          event.touches[0].pageY
        );

        arrowFade();
        scaleStart = scaleMove;
        return false;
      }
      function touchHandlerEnd(event) {
        if ($("html.android41").length) {
          event.preventDefault();
        }
      }
      $(function () {
        if (isMobile) {
          touchInit();
          return;
        }
      });

      drawImg(obj, S_asr, "img/main/main.jpg?111");
      zoom(obj, setting.initial);
      function reSizeHandler() {
        canvas_height = $(".img_area").height();
        canvas_width = $(".img_area").width();
        jZoom.width(canvas_width).height(canvas_height);
        default_asr = canvas_width / canvas_height;
        zoom_e = setting.initial;
        drawImg(obj, S_asr, "img/main/main.jpg?111");
        zoom(obj, setting.initial);
      }
      window.onresize = reSizeHandler;

      function setThumb() {
        var h = "";
        for (var i = 0; i < 25; i++) {
          h += "<div></div>";
		}
		$('.thumb .ts').append(h)
	  }
	  setThumb()
    });
  };
});
