var c;
var canvas;
var img;
var cs;
var map;

var bounds = {};
bounds.x = 50;
bounds.y = 0;
bounds.w = 700;
bounds.h = 500;
var selected = -1;

var h = [];
h[0] = newh(100, 100, 100);

vx = 0;
vy = 0;
zoom = 1;

var mx = -1;
var my = -1;
var dx = 0;
var dy = 0;
var drag = false;
var rad = false;

function newh(x, y, r){
	var h = {};
	h.x = x;
	h.y = y;
	h.r = r;
	return h;
}

function mmove(e){
	mx = e.x - canvas.getBoundingClientRect().left;
	my = e.y - canvas.getBoundingClientRect().top;
	if (e.buttons == 0) {
	}
	if (drag) {
	if (selected != -1) {
			var x = e.x - canvas.getBoundingClientRect().left - dx;
			var y = e.y - canvas.getBoundingClientRect().top - dy;
			h[selected].x += x;
			h[selected].y += y;
			dx = mx;
			dy = my;
		}
	}
	if (rad){
		if (selected != -1) h[selected].r = Math.sqrt((mx - h[selected].x)*(mx - h[selected].x)+(my - h[selected].y)*(my - h[selected].y));
	}
	draw();
}

function kdown(e){
	if (e.keyCode == 8 || e.keyCode == 27 || e.keyCode == 46) {
		if (selected != -1){
			for (var i = selected + 1; i < h.length; i++){
				h[i-1]=h[i];
			}
			h.length--;
			selected = -1;
			drag = false;
			rad = false;
		}
	}
	draw();
}

function mdown(e){
	drag = true;
	
	dx = e.x - canvas.getBoundingClientRect().left;
	dy = e.y - canvas.getBoundingClientRect().top;
	
	var min = 100000000;
	var s = -1;
	for (var i = 0; i < h.length; i++){
		var d = Math.sqrt((dx - h[i].x)*(dx - h[i].x)+(dy - h[i].y)*(dy - h[i].y));
		if (Math.abs(d-h[i].r) < 10 && d < min){
			min = d;
			s = i;
		}
	}
	if (s != -1){
		selected = s;
		rad = true;
		drag = false;
	} else {
		if (selected != -1){
			var d2 = Math.sqrt((dx - h[selected].x)*(dx - h[selected].x)+(dy - h[selected].y)*(dy - h[selected].y));
			if (d2 > h[selected].r){
				min = 100000000;
				s = -1;
				for (var i = 0; i < h.length; i++){
					d = Math.sqrt((dx - h[i].x)*(dx - h[i].x)+(dy - h[i].y)*(dy - h[i].y));
					if (d < h[i].r+5 && d < min){
						min = d;
						s = i;
					}
				}
				if (selected == s){
					selected = -1;
					drag = false;
					rad = false;
				} else {
					selected = s;
					drag = true;
					rad = false;
					if (s == -1){
						selected = h.length;
						h[h.length] = newh(dx, dy,1);
						rad = true;
						drag = false;
					}
				}
			}
		} else {
			min = 100000000;
			s = -1;
			for (var i = 0; i < h.length; i++){
				d = Math.sqrt((dx - h[i].x)*(dx - h[i].x)+(dy - h[i].y)*(dy - h[i].y));
				if (d < h[i].r+5 && d < min){
					min = d;
					s = i;
				}
			}
			selected = s;
			drag = true;
			rad = false;
			if (s == -1){
				selected = h.length;
				h[h.length] = newh(dx, dy,1);
				rad = true;
				drag = false;
			}
		}
	}
	draw();
}

function mup(e){
	
	drag = false;
	rad = false;
}

function mout(e){
	mx = -1;
	my = -1;
	drag = false;
}

function mwheel(e){
	var delta = parseInt(width * (e.wheelDelta * (-0.0002)));
	start = start - delta;
	width = width + 2 * delta;
	draw();
}

window.onresize = function(e){
};

function draw(){
	bounds.y = 0;
	bounds.h = canvas.height;
	bounds.w = canvas.width - bounds.x;
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = "#fff";
	c.fillRect(0, 0, canvas.width, canvas.height);
	c.drawImage(map, 0, 0, canvas.width, canvas.height);
	
	c.lineWidth = 4;
	for (var i = 0; i < h.length; i++){
		if (selected != i){
			c.strokeStyle = "#f00";
			c.fillStyle = "rgba(255, 0, 0, 0.3)";
			c.beginPath();
			c.arc(h[i].x, h[i].y,h[i].r, 0, 2*Math.PI);
			c.stroke();
			c.fill();
		}
	}
	if (selected != -1){
		var i = selected;
		c.strokeStyle = "#07f";
		c.fillStyle = "rgba(0, 127, 255, 0.3)";
		c.beginPath();
		c.arc(h[i].x, h[i].y,h[i].r, 0, 2*Math.PI);
		c.stroke();
		c.fill();
	}
}

function clock(){
	draw();
}

function begin(){
	canvas = document.getElementById("chart");
	map = new Image();
	map.src = "world-map.gif";
	c = canvas.getContext("2d");
	c.lineWidth = 1.5;
	
	canvas.addEventListener('mousewheel',function(event){
		mwheel(event);
		event.returnValue = false;
		return false; 
	}, false);
	
	canvas.addEventListener('mousemove',function(event){
		mmove(event);
		return false; 
	}, false);
	
	canvas.addEventListener('mouseup',function(event){
		mup(event);
		return false; 
	}, false);
	
	canvas.addEventListener('mousedown',function(event){
		mdown(event);
		return false; 
	}, false);
	
	document.addEventListener('keydown',function(event){
		kdown(event);
		return false; 
	}, false);
	
	canvas.addEventListener('mouseout',function(event){
		mout(event);
		return false; 
	}, false);
	
	
	
	draw();
	//setInterval(clock, 18);
}

setTimeout(begin, 100);