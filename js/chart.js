var c;
var canvas;
var img;
var cs;
var scale = 1;

var buttons = [];

var bounds = {};
bounds.x = 200;
bounds.y = 0;
bounds.x2= 140;
bounds.h = 500;

var fish = true;
var draggable = false;

var hx = -1;
var hy = -1;
var mx = -1;
var my = -1;
var selected = -1;
var drag = false;
var cx = -1;
var cy = -1;
var dx = 0;
var dy = 0;
var maxmag = 1;

var start = 400;
var width = 200;
var max;
var s = [];
var strats = [];
strats[0] = generateSeries([3000]);
strats[1] = generateSeries([3000]);
strats[2] = generateSeries([3000]);
strats[3] = generateSeries([3000]);
strats[4] = generateSeries([3000]);
strats[5] = generateSeries([3000]);
//all series fill graph
//all series proportional to absolute values
//all series proportional to change
//all series at absolute values

getMax();

buttons[0] = {x:20, y:20, w: 100, h:20, a:function(e){
	series(e);
}};
buttons[0].list=false;

function generateSeries(parameters = [1000/*series length*/, 1/*white noise size*/, 0.025/*bull chance*/, 2/*bull gradient*/, 0.0066666/*bear chance*/, -5/*bear gradient*/]) {
	var s = {};
	var sd = [];
	var sl = parameters[0];
	var max = 0;
	var noise = 0;
	var vel = 2;
	var data = 1;
	var noise_mag = 0.5;
	var noise_delta = 0.1;
	var bullc = parameters[1];
	var bullm = parameters[2]
	var bearc = parameters[3]
	var bearm = parameters[4]
	if (parameters.length < 2){
		bullc = 0.025;
		bullm = 2;
		bearc = 0.0066666;
		bearm = -5;
	}
	
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
		if (vel == bullm && Math.random() < bearc) vel = bearm;
		else if (vel == bearm && Math.random() < bullc) vel = bullm;
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
	var al = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	s.name = al.charAt(parseInt(Math.random()*26))+al.charAt(parseInt(Math.random()*26))+al.charAt(parseInt(Math.random()*26));
	s.length = sl;
	s.start = 0;
	s.data = sd;
	s.max = max;
	s.first = 1;
	s.colour = chooseColour();
	return s;
}

function chooseColour(){
	if (strats.length == 0) return Math.random();
	if (strats.length == 1){
		var col = strats[0].colour + 0.25 + Math.random()*0.5;
		if (col >= 1) col--;
		return col;
	}
	for (var i = 0; i < strats.length; i++){
		for (var j = i + 1; j < strats.length; j++){
			if (strats[i].colour > strats[j].colour){
				var o = strats[i];
				strats[i] = strats[j];
				strats[j] = o;
			}
		}
	}
	var bgap = 0;
	var j = -1;
	for (var i = 0; i < strats.length - 1; i++){
		var tgap = strats[i+1].colour-strats[i].colour;
		if (tgap > bgap){
			bgap = tgap
			j = i;
		}
	}
	var tgap = strats[0].colour - (strats[strats.length-1].colour - 1);
	if (tgap > bgap){
		bgap = tgap
		j = strats.length-1;
	}
	var col = strats[j].colour + bgap / 2;
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
	if (maxmag == 0) maxmag = 2;
	maxmag = 1 / maxmag;
}

function getX(i, j){
	return parseInt(j*(canvas.width - bounds.x - bounds.x2)/(width - 1))+bounds.x;
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
		if (!draggable || selected == -1){
			start = start - x*(width - 1)/canvas.width;
		} else {
            s[selected].start -= x*(width - 1)/canvas.width;
		}
	}
	
	
	var closest = 1000;
	var cindex = -1;
	for (var i = 0; i < s.length; i++){
		for (var j = 0; j < width; j++){
			var k = j + parseInt(start + s[i].start);
			if (k >= 0 && k < s[i].length){
				var ax = getX(i,j);
				var ay = getY(i,j);
				var bx = getX(i,j+1);
				var by = getY(i,j+1);
				var t = (mx-ax)/(bx-ax);
				t = t < 0 ? 0 : t > 1 ? 1 : t;
				var cx = ax + t * (bx-ax);
				var cy = ay + t * (by-ay);
				var d = Math.sqrt((cx - mx) * (cx - mx) + (cy - my) * (cy - my));
				if ((cindex == selected && i == selected && d < closest) || (cindex != selected && d < closest) || (-1 == selected && d < closest)){
					closest = d;
					cindex = i;
					hx = cx;
					hy = cy;
				}
			}
		}
	}
	if (closest > 10){
        hx = -1;
        hy = -1;
	}
	getMax();
	drawStock();
}

function mdown(e){
	drag = true;
    
	dx = e.x - canvas.getBoundingClientRect().left;
	dy = e.y - canvas.getBoundingClientRect().top;
	if (dx >= 20 && dy >= 20 && dx <= 120 && dy <= 40){
		buttons[0].list = !buttons[0].list;
	} else if (buttons[0].list && (dx  >= 20 && dy >= 40 && dx <= 120 && dy <= 40+20*strats.length)){
		var k = parseInt((dy-40)/20);
		var exists = false;
		var series = strats[k];
		for (var i = 0; i < s.length; i++){
			exists=series==s[i]?true:exists;
		}
		if (!exists){
			s[s.length]=series;
		}
		buttons[0].list=false;
	} else {
		if (dx >= 20 && dy >= 60 && dx <= 120 && dy <= 80){
			fish = !fish;
		}
		for (var i = 0; i < s.length; i++){
			if (dx >= canvas.width - bounds.x2 + 20 && dy >= 20+30*i && dx <= canvas.width - bounds.x2 + 120 && dy <= 40+30*i){
				for (var j = i + 1; j < s.length; j++){
					s[j-1] = s[j];
				}
				s.length--;
			}
		}
		buttons[0].list=false;
	}
	var closest = 1000;
	var cindex = -1;
	for (var i = 0; i < s.length; i++){
		for (var j = 0; j < width; j++){
			var k = j + parseInt(start + s[i].start);
			if (k >= 0 && k < s[i].length){
				var ax = getX(i,j);
				var ay = getY(i,j);
				var bx = getX(i,j+1);
				var by = getY(i,j+1);
				var t = (dx-ax)/(bx-ax);
				t = t < 0 ? 0 : t > 1 ? 1 : t;
				var cx = ax + t * (bx-ax);
				var cy = ay + t * (by-ay);
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
	if (delta > 0 && scale > 30) return;
	start = start - delta;
	width = width + 2 * delta;
	getMax();
	drawStock();
}

function fishEye(x, y){
	if (mx < bounds.x || mx > bounds.x + canvas.width - bounds.x - bounds.x2 || my < bounds.y || my > bounds.y + bounds.h || !fish){
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

window.onresize = function(e){
};

function drawStock(){
	bounds.h = canvas.height - 2 * bounds.y;
	var unit = bounds.h*maxmag;
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = "#ddffdd";
	c.fillRect(bounds.x, bounds.y, canvas.width - bounds.x - bounds.x2, bounds.h-unit);
	c.fillStyle = "#ffe9e9";
	c.fillRect(bounds.x, bounds.h-unit+bounds.y, canvas.width - bounds.x - bounds.x2, unit);
	scale = bounds.h / unit;
	c.lineWidth = 1;
	c.strokeStyle = "#000";
	for (var i = 0; i < scale; i++){
		if (scale < 10){
			for (var j = 0; j < 10; j++){
				if (i + j / 10.0 < scale && i+j>0){
					c.lineWidth = 1;
					c.strokeStyle = j==0?"#000":j==5?"#444":"#999";
					c.beginPath();
					for (var k = 0; k < (canvas.width - bounds.x - bounds.x2)/5; k++){
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
					for (var k = 0; k < (canvas.width - bounds.x - bounds.x2)/5; k++){
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
			c.strokeStyle = "hsl("+parseInt(0+s[i].colour*120)+", 100%, 40%)";
		}
		c.beginPath();
		var j = 0;
		var k = j + parseInt(start + s[i].start);
		for (var l = 0; l < s[i].data.length; l++){
			if (parseInt((l - parseInt(start + s[i].start))*(canvas.width - bounds.x - bounds.x2)/(width - 1)) <= 0){
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
	c.lineWidth = 2;
	c.beginPath();
	for (var k = 0; k < bounds.h/5; k++){
		var x = parseInt((canvas.width - bounds.x - bounds.x2)/8+bounds.x);
		var y = bounds.y + 5 * k;
		var p1 = fishEye(x, y);
		var p2 = fishEye(x, y+5);
		c.moveTo(p1.x, p1.y);
		c.lineTo(p2.x, p2.y);
	}
	c.stroke();
	
	
	
	c.fillStyle = "#95a3d0";
	c.fillRect(0, 0, canvas.width, bounds.y);
	c.fillRect(0, bounds.y + bounds.h, canvas.width, bounds.y);
	c.fillRect(0, 0, bounds.x, canvas.height);
	c.fillRect(canvas.width - bounds.x2, 0, bounds.x2, canvas.height);
	
	
	c.font = "14px Tahoma";
	c.fillStyle = "#000";
	for (var i = 0; i < scale; i++){
		if (scale < 2.5){
			for (var j = 0; j < 10; j++){
				var x = bounds.x - 60;
				var y = bounds.h - unit * (i+j/10.0) + bounds.y;
				var n = 100*i+10*j-100;
				n=n<0?n+"":"+"+n;
				c.fillText(n+"%", x, y);
			}
		}
		else if (scale < 10){
			for (var j = 0; j < 10; j+=5){
				var x = bounds.x - 60;
				var y = bounds.h - unit * (i+j/10.0) + bounds.y;
				var n = 100*i+10*j-100;
				n=n<0?n+"":"+"+n;
				c.fillText(n+"%", x, y);
			}
		}
		else {
			var x = bounds.x - 60;
			var y = bounds.h - unit * i + bounds.y;
			var n = 100*i-100;
			n=n<0?n+"":"+"+n;
			c.fillText(n+"%", x, y);
		}
	}
	
	if (hx != -1){
		var p = fishEye(hx,hy);
		var v = (bounds.h + bounds.y - hy) / unit;
		var n = (v - 1) * 100+"";
		n = n.substring(0, 5);
		n = n.endsWith(".")?n.substring(0,n.length-1):n;
		n = n.includes(".")?n:(parseInt((v - 1) * 100)+"");
		n=n<0?n+"":"+"+n;
		c.fillStyle="#00f";
		c.beginPath();
		c.arc(p.x, p.y, 5, 0, 2*Math.PI);
		c.fill();
		c.fillStyle="#000";
		c.fillText(n+"%", p.x+7, p.y+4);
	}
	
	c.fillStyle = "#fff";
	c.fillRect(20,60,100,20);
	c.fillStyle = "#000";
	if(fish) c.fillText("Disengage Fish", 24,74);
	else c.fillText("Engage Fish", 24,74);
	
	c.fillStyle = "#fff";
	c.fillRect(20,20,100,20);
	c.fillStyle = "#000";
	c.fillText("Add Series", 24,34);
	
	for (var i = 0; i < s.length; i++){
		c.fillStyle = "hsl("+parseInt(0+s[i].colour*120)+", 100%, 40%)";
		c.fillRect(canvas.width - bounds.x2 + 20, 20+30*i, 100, 20);
		c.fillStyle = "#000";
		c.fillText(s[i].name, canvas.width - bounds.x2 + 25, 20+30*i+14);
	}
	
	if (buttons[0].list){
		for (var i = 0; i < strats.length; i++){
			c.fillStyle = "#fff";
			c.fillRect(20, 40+20*i, 100, 20);
			c.fillStyle = "#000";
			c.fillText(strats[i].name, 25, 40+20*i+14);
		}
	}
}

function clock(){
	drawStock();
}

window.onresize = function(e){
	canvas.top = -parseInt(cs.getPropertyValue('height'), 10);
	canvas.width = parseInt(cs.getPropertyValue('width'), 10);
	canvas.height = parseInt(cs.getPropertyValue('height'), 10);
};

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
	
	canvas.addEventListener('mouseout',function(event){
		mout(event);
		return false; 
	}, false);
	
	
	
	drawStock();
	//setInterval(clock, 18);
}

setTimeout(begin, 100);