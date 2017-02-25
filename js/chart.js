var c;
var canvas;
var img;
var cs;

var bounds = {};
bounds.x = 0;
bounds.y = 0;
bounds.w = 700;
bounds.h = 500;

var fish = true;

var mx = -1;
var my = -1;
var selected = -1;
var drag = false;
var cx = -1;
var cy = -1;
var dx = 0;
var dy = 0;
var maxmag = 1;

var start = 0;
var width = 1000;
var max;
var s = [];
s[0] = generateSeries();
s[1] = generateSeries();
s[2] = generateSeries();
s[3] = generateSeries();
s[4] = generateSeries();
s[5] = generateSeries();
//all series fill graph
//all series proportional to absolute values
//all series proportional to change
//all series at absolute values

getMax();

function generateSeries() {
	var s = {};
	var noise_mag = 0.5;
	var noise_delta = 0.1;
	var sd = [];
	var sl = 3000;
	var max = 0;
	var noise = 0;
	var vel = 2;
	var data = 1;
	
	for (var i = 0; i < sl; i++){
		sd[i] = 1;
	}

	function changeStock(){
		noise += data*(Math.random()-0.5)*noise_delta;
		while (noise > data*noise_mag || noise < -data*noise_mag){
			if (noise > data*noise_mag) noise = data*noise_mag;
			if (noise < -data*noise_mag) noise = -data*noise_mag;
			noise += data*(Math.random()-0.5)*noise_delta;
		}
		if (vel == 2 && Math.random() < 0.0066666) vel = -5;
		else if (vel == -5 && Math.random() < 0.025) vel = 2;
		for (var i = 0; i < sl-1; i++) {
			sd[i] = sd[i+1];
		}
		data = data*(1+vel/600);
		sd[sl-1] = data+noise;
		max = 0;
		for (var i = 0; i < sl-1; i++) {
			if (sd[i]>max)max=sd[i];
		}
	}

	for (var i = 0; i < sl; i++){
		changeStock();
	}
	
	s.length = sl;
	s.start = 0;
	s.data = sd;
	s.max = max;
	s.first = 1;
	s.colour = chooseColour();
	return s;
}

function chooseColour(){
	if (s.length == 0) return Math.random();
	if (s.length == 1){
		var col = s[0].colour + 0.25 + Math.random()*0.5;
		if (col >= 1) col--;
		return col;
	}
	for (var i = 0; i < s.length; i++){
		for (var j = i + 1; j < s.length; j++){
			if (s[i].colour > s[j].colour){
				var o = s[i];
				s[i] = s[j];
				s[j] = o;
			}
		}
	}
	var bgap = 0;
	var j = -1;
	for (var i = 0; i < s.length - 1; i++){
		var tgap = s[i+1].colour-s[i].colour;
		if (tgap > bgap){
			bgap = tgap
			j = i;
		}
	}
	var tgap = s[0].colour - (s[s.length-1].colour - 1);
	if (tgap > bgap){
		bgap = tgap
		j = s.length-1;
	}
	var col = s[j].colour + bgap / 2;
	if (col >= 1) col--;
	return col;
}

function getMax(){
	max = 0;
	for (var i = 0; i < s.length; i++){
		s[i].max = 0;
		for (var j =  0; j < width; j++){
			var k = j + parseInt(start + s[i].start);
			if (k >= 0 && k < s[i].length){
				if (s[i].data[k] > max){
					max = s[i].data[k];
				}
				if (s[i].data[k] > s[i].max){
					s[i].max = s[i].data[k]
				}
			}
		}
		var j = parseInt(start + s[i].start);
		s[i].first = 1;
		if (j+parseInt(width/8) < s[i].length){
			if (j >= -parseInt(width/8)) {
				s[i].first = s[i].data[j+parseInt(width/8)];
			}else{
				s[i].first = s[i].data[parseInt(width/8)];
			}
		}
	}
	maxmag = 0;
	for (var i = 0; i < s.length; i++){
		if (s[i].max/s[i].first>maxmag){
			maxmag = s[i].max/s[i].first;
		}
	}
	maxmag = 1 / maxmag;
}

function getX(i, j){
	return parseInt(j*bounds.w/(width - 1))+bounds.x;
}

function getY(i, j){
	return bounds.h-s[i].data[j + parseInt(start + s[i].start)]*bounds.h*maxmag/s[i].first+bounds.y;
}

function mmove(e){
	mx = e.x - canvas.getBoundingClientRect().left;
	my = e.y - canvas.getBoundingClientRect().top;
	if (e.buttons == 0) {
	}
	if (drag) {		
		var x = e.x - canvas.getBoundingClientRect().left - dx;
		var y = e.y - canvas.getBoundingClientRect().top - dy;
		dx = e.x - canvas.getBoundingClientRect().left;
		dy = e.y - canvas.getBoundingClientRect().top;
		if (selected == -1){
			start = start - x*(width - 1)/canvas.width;
		} else {
            s[selected].start -= x*(width - 1)/canvas.width;
		}
	}
	getMax();
	drawStock();
}

function mdown(e){
	drag = true;
    
	dx = e.x - canvas.getBoundingClientRect().left;
	dy = e.y - canvas.getBoundingClientRect().top;
	var closest = 1000;
	var cindex = -1;
	for (var i = 0; i < s.length; i++){
		for (var j = 0; j < width; j++){
			var k = j + parseInt(start + s[i].start);
			if (k >= 0 && k < s[i].length){
				var ax = getX(i,j);
				var ay = getY(i,j);
				var bx = getX(i,j+1) - ax;
				var by = getY(i,j+1) - ay;
				var t = (ax * bx + ay * by - bx * dx - by * dy) / (bx * bx + by * by);
				t = t < 0 ? 0 : t > 1 ? 1 : t;
				var cx = ax + t * bx;
				var cy = ay + t * by;
				var d = Math.sqrt((cx - dx) * (cx - dx) + (cy - dy) * (cy - dy));
				if (d < closest){
					closest = d;
					cindex = i;
				}
			}
		}
	}
	if (closest < 10){
		if (cindex != -1 & cindex == selected) {
			selected = -1;
		}
		selected = cindex;
        cx = dx;
        cy = dy;
	} else {
		selected = -1;
	}
	getMax();
	drawStock();
}

function mup(e){
	drag = false;
    if (cx != -1 || cy != -1) {
        cx = -1;
        cy = -1;
    }
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
	getMax();
	drawStock();
}

function fishEye(x, y){
	if (mx < bounds.x || mx > bounds.x + bounds.w || my < bounds.y || my > bounds.y + bounds.h || !fish){
		var s = {};
		s.x = x;
		s.y = y;
		return s;
	}
	d = Math.sqrt((x - mx) * (x - mx) + (y - my) * (y - my));
	var max = 100;
	var s = {};
	s.x = x;
	s.y = y;
	if (d < max){
		var v = {};
		v.x = x - mx;
		v.y = y - my;
		s.x = parseInt(x + 2 *  v.x * Math.pow((max - d)/max, 2));
		s.y = parseInt(y + 2 * v.y * Math.pow((max - d)/max, 2));
	}
	return s;
}

function drawStock(){
	canvas.top = -parseInt(cs.getPropertyValue('height'), 10);
	canvas.width = parseInt(cs.getPropertyValue('width'), 10);
	canvas.height = parseInt(cs.getPropertyValue('height'), 10);
	bounds.h = canvas.height - 2 * bounds.y;
	bounds.w = canvas.width - 2 * bounds.x;
	var unit = s[0].first*bounds.h*maxmag/s[0].first;
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = "#ddffdd";
	c.fillRect(bounds.x, bounds.y, bounds.w, bounds.h-unit);
	c.fillStyle = "#ffe9e9";
	c.fillRect(bounds.x, bounds.h-unit+bounds.y, bounds.w, unit);
	var scale = bounds.h / unit;
	c.lineWidth = 1;
	c.strokeStyle = "#000";
	for (var i = 0; i < scale; i++){
		if (scale < 10){
			for (var j = 0; j < 10; j++){
				if (i + j / 10.0 < scale && i+j>0){
					c.lineWidth = 1;
					c.strokeStyle = j==0?"#000":j==5?"#444":"#999";
					c.beginPath();
					for (var k = 0; k < bounds.w/5; k++){
						var x = bounds.x + k * 5;
						var y = bounds.h - unit * (i+j/10.0) + bounds.y;
						var p1 = fishEye(x, y);
						var p2 = fishEye(x+5, y);
						c.moveTo(p1.x, p1.y);
						c.lineTo(p2.x, p2.y);
					}
					c.stroke();
				}
			}
		}else {
			if ( i>0){
					c.lineWidth = 1;
					c.strokeStyle = i%10==0?"#000":i%10==5?"#444":"#999";
					c.beginPath();
					for (var k = 0; k < bounds.w/5; k++){
						var x = bounds.x + k * 5;
						var y = bounds.h - unit * i + bounds.y;
						var p1 = fishEye(x, y);
						var p2 = fishEye(x+5, y);
						c.moveTo(p1.x, p1.y);
						c.lineTo(p2.x, p2.y);
					}
					c.stroke();
				}
		}
	}
	for (var i = 0; i < s.length; i++){
		if (i == selected) {
			c.lineWidth = 3;
			c.strokeStyle = "#000fff";
		} else {
			c.lineWidth = 1.5;
			c.strokeStyle = "hsl("+parseInt(0+s[i].colour*120)+", 100%, 40%)";;
		}
		c.beginPath();
		var j = 0;
		var k = j + parseInt(start + s[i].start);
		for (var l = 0; l < s[i].data.length; l++){
			if (parseInt((l - parseInt(start + s[i].start))*bounds.w/(width - 1)) <= 0){
				j = l - parseInt(start + s[i].start);
				k = l;
			}
		}
		var p = fishEye(getX(i,j), getY(i,j));
		c.moveTo(p.x, p.y);
		for (j =  0; j < width; j++){
			k = j + parseInt(start + s[i].start);
			if (k < s[i].length){
				p = fishEye(getX(i,j), getY(i,j));
				c.lineTo(p.x, p.y);
			}
		}
		c.stroke();
	}
	c.strokeStyle = "#000";
	c.linewidth = 2;
	c.beginPath();
	for (var k = 0; k < bounds.h/5; k++){
		var x = parseInt(bounds.w/8+bounds.x);
		var y = bounds.y + 5 * k;
		var p1 = fishEye(x, y);
		var p2 = fishEye(x, y+5);
		c.moveTo(p1.x, p1.y);
		c.lineTo(p2.x, p2.y);
	}
	c.stroke();
	c.fillStyle = "#ffffff";
	c.fillRect(0, 0, canvas.width, bounds.y);
	c.fillRect(0, bounds.y + bounds.h, canvas.width, bounds.y);
	c.fillRect(0, 0, bounds.x, canvas.height);
	c.fillRect(bounds.x + bounds.w, 0, bounds.x, canvas.height);
	
}

function clock(){
	drawStock();
}

function begin(){
	img = document.getElementById("canimg");
	cs = getComputedStyle(img);
	canvas = document.getElementById("chart");
	c = canvas.getContext("2d");
	c.lineWidth = 1.5;
	canvas.top = -parseInt(cs.getPropertyValue('height'), 10);
	canvas.width = parseInt(cs.getPropertyValue('width'), 10);
	canvas.height = parseInt(cs.getPropertyValue('height'), 10);
	
	canvas.addEventListener('mousewheel',function(event){
		mwheel(event);
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
	
	canvas.addEventListener('mouseout',function(event){
		mout(event);
		return false; 
	}, false);
	
	
	
	drawStock();
	//setInterval(clock, 18);
}

setTimeout(begin, 100);