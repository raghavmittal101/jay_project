var count = 0;
var canvas0 = document.getElementById('myCanvas_1');
var cxt = canvas0.getContext('2d');

var canvas1 = document.getElementById('myCanvas0');
var cxt0 = canvas1.getContext('2d');

var image_path = getPath();
var first_img = document.createElement
var first_img = document.createElement("img");
first_img.src = image_path + img_array[0];
cxt0.drawImage(first_img, 0, 0);

var point_list_1 = [];
var point_list_2 = [];

var polygon_1 = true;
var polygon_2 = false;

var dragok = false;
var drag_cent_1 = false;
var drag_cent_2 = false;

var startX;
var startY;

var BB = canvas0.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;

var userDetails = [];
function getDetails(){
  if(document.getElementById("tnc-check").checked &&
    !document.getElementById("email-input").validity.typeMismatch &&
    !document.getElementById("email-input").validity.valueMissing &&
    !document.getElementById("name-input").validity.valueMissing){
    username = document.getElementById("name-input").value;
    email = document.getElementById("email-input").value;
    userDetails.push(username); userDetails.push(email);
    console.log(userDetails);
    document.getElementById("cover").remove();
  }
}

function Save() {
    // TAKE THIS JSON AND STORE
    var list = [];
    var json_obj = {"id": img_array[count], "list": list.concat(userDetails, point_list_1, point_list_2)};
    document.getElementById('save-btn').disabled = true;
    document.getElementById('save-btn').innerText = "Saving...";
    send(json_obj);
    console.log(JSON.stringify(json_obj));
    document.getElementById('save-btn').disabled = false;
    document.getElementById('save-btn').innerText = "Save";
    return;
}

function Previous(){
	if(count == 0){return null;}
	else count = count - 1;
    document.getElementById('prev-btn').disabled = true;
    document.getElementById('prev-btn').innerText = 'Loading';
    // document.getElementById('loader').style.display = 'inline-block';
    var img = new Image();
    img.src = image_path + img_array[count]
    img.onload = function(){
        cxt0.clearRect(0, 0, canvas0.width, canvas0.height);
        cxt0.drawImage(img, 0, 0);
        document.getElementById("FileName").innerHTML = img_array[count];
        document.getElementById("ImageCount").innerHTML = count+1;
        // document.getElementById('loader').style.display = 'none';
        document.getElementById('prev-btn').innerText = 'Previous';
        document.getElementById('prev-btn').disabled = false;
    };
}

function Next() {
	count = count + 1;
    document.getElementById('next-btn').disabled = true;
    document.getElementById('next-btn').innerText = 'Loading';
    // document.getElementById('loader').style.display = 'inline-block';
    var img = new Image();
    img.src = image_path + img_array[count]
    img.onload = function(){
        cxt0.clearRect(0, 0, canvas0.width, canvas0.height);
        cxt0.drawImage(img, 0, 0);
        document.getElementById("FileName").innerHTML = img_array[count];
        document.getElementById("ImageCount").innerHTML = count+1;
        // document.getElementById('loader').style.display = 'none';
        document.getElementById('next-btn').innerText = 'Next';
        document.getElementById('next-btn').disabled = false;
    };
}


function clear() {
 var canvas0 = document.getElementById('myCanvas_1');
 var cxt = canvas0.getContext('2d');
 cxt.clearRect(0, 0, canvas0.width, canvas0.height);
}

function scale(factor, pt_list) {
 var x_before = center(pt_list)['mid_x'];
 var y_before = center(pt_list)['mid_y'];
 for(var i = 0; i < window[pt_list].length; i++) {
  window[pt_list][i]['x'] = window[pt_list][i]['x'] * factor;
  window[pt_list][i]['y'] = window[pt_list][i]['y'] * factor;
 }
 var x_dif = center(pt_list)['mid_x'] - x_before;
 var y_dif = center(pt_list)['mid_y'] - y_before;
 for(var i = 0; i < window[pt_list].length; i++) {
  window[pt_list][i]['x'] = window[pt_list][i]['x'] - x_dif;
  window[pt_list][i]['y'] = window[pt_list][i]['y'] - y_dif;
 }
}

function ScaleDown()   {
 if(polygon_1 == true) {
  scale(.99, "point_list_1");
 }
 else if (polygon_2 == true) {
  scale(.99, "point_list_2");
 }
}

function ScaleUp()   {
 if(polygon_1 == true) {
  scale(1.01, "point_list_1");
 }
 else if (polygon_2 == true) {
  scale(1.01, "point_list_2");
 }
}

function draw_point(c1_x, c1_y, style) {
 var canvas0 = document.getElementById('myCanvas_1');
 var cxt = canvas0.getContext('2d');
 cxt.beginPath();
 cxt.strokeStyle =  style;
 cxt.arc(c1_x, c1_y, 5, 0, 2 * Math.PI, false);
 cxt.lineWidth = 3;
 cxt.stroke();
}

function point_list_gen(pt_list, no_of_sides, size, center_x, center_y) {
 for (var i = 0; i <  no_of_sides; i = i + 1) {
  var x_1 =  center_x + size * Math.cos(i * 2 * Math.PI / no_of_sides);
  var y_1 =  center_y + size * Math.sin(i * 2 * Math.PI / no_of_sides);
  window[pt_list].push({'x':x_1, 'y':y_1, 'drag':false});
 }
 window[pt_list].push({'x':window[pt_list][0]['x'], 'y':window[pt_list][0]['y'], 'drag':false});
}

function draw_line(x0,y0,x1,y1, style) {
 var c = document.getElementById("myCanvas_1");
 var cxt = c.getContext("2d");
 cxt.beginPath();
 cxt.strokeStyle = style;
 cxt.moveTo(x0, y0);
 cxt.lineTo(x1, y1);
 cxt.stroke();
}

function draw_polygon(pt_list, style) {
 for (var i = 0; i <  window[pt_list].length-1; i = i + 1) {
  draw_line(window[pt_list][i]['x'], window[pt_list][i]['y'], window[pt_list][i+1]['x'], window[pt_list][i+1]['y'], style);
 }
}

function draw_points(pt_list, style) {
 for(var i = 0; i < window[pt_list].length; i = i + 1) {
  draw_point(window[pt_list][i]['x'], window[pt_list][i]['y'], style);
 }
}

function myDown(e) {

 var mx = parseInt(e.pageX-offsetX);
 var my = parseInt(e.pageY-offsetY);

 dragok = false;

  if(Math.pow((center("point_list_1")['mid_x'] - mx), 2) + Math.pow((center("point_list_1")['mid_y'] - my), 2) < 25) {
   polygon_1 = true;
   polygon_2 = false;
   drag_cent_1 = true;
  }
  for(var i = 0;i < point_list_1.length; i = i + 1) {
   var sx = point_list_1[i]['x'];
   var sy = point_list_1[i]['y'];
   var dx = sx - mx;
   var dy = sy - my;
   if(dx*dx + dy*dy < 25) {
    polygon_1 = true;
    polygon_2 = false;
    dragok = true;
    point_list_1[i]['drag'] = true;
   }
  }

  if(Math.pow((center("point_list_2")['mid_x'] - mx), 2) + Math.pow((center("point_list_2")['mid_y'] - my), 2) < 25) {
    polygon_1 = false;
    polygon_2 =  true;
   drag_cent_2 = true;
  }
  for(var i = 0;i < point_list_2.length; i = i + 1) {
   var sx = point_list_2[i]['x'];
   var sy = point_list_2[i]['y'];
   var dx = sx - mx;
   var dy = sy - my;
   if(dx*dx + dy*dy < 25) {
    polygon_1 = false;
    polygon_2 =  true;
    dragok = true;
    point_list_2[i]['drag'] = true;
   }
  }

 startX = mx;
 startY = my;
}

function myUp(e) {
 dragok = false;
 for(var i=0;i<point_list_1.length;i++) {
  point_list_1[i]['drag']=false;
 }
 for(var i=0;i<point_list_2.length;i++) {
  point_list_2[i]['drag']=false;
 }
 drag_cent_1 = false;
 drag_cent_2 = false;
}

function myMove(e) {
 var mx = parseInt(e.pageX-offsetX);
 var my = parseInt(e.pageY-offsetY);
 var dx = mx-startX;
 var dy = my-startY;
 if (dragok) {
  for(var i=0;i < point_list_1.length;i++) {
   var s1 = point_list_1[i];
   if(s1['drag']) {
    s1['x']+=dx;
    s1['y']+=dy;
   }
  }
  for(var i=0;i < point_list_2.length;i++) {
   var s2 = point_list_2[i];
   if(s2['drag']) {
    s2['x']+=dx;
    s2['y']+=dy;
   }
  }
 }
 if(drag_cent_1) {
  for(var i = 0; i < point_list_1.length; i++) {
   point_list_1[i]['x'] += dx;
   point_list_1[i]['y'] += dy;
  }
 }

 if(drag_cent_2) {
  for(var i = 0; i < point_list_2.length; i++) {
   point_list_2[i]['x'] += dx;
   point_list_2[i]['y'] += dy;
  }
 }

 startX = mx;
 startY = my;
}

function initial_point_gen() {
 point_list_gen("point_list_1",18,200,300,300);
 point_list_gen("point_list_2",14,150,500,500);
}

function draw() {
  clear();
  var mid_x_1 = center("point_list_1")["mid_x"];
  var mid_y_1 = center("point_list_1")["mid_y"];

  if(polygon_1) {
   draw_polygon("point_list_1", "#00FFFF");
   draw_points("point_list_1", "#7CFC00");
   draw_point(mid_x_1, mid_y_1, "#7CFC00");
  }
  else {
   draw_polygon("point_list_1", "#00FFFF");
   draw_points("point_list_1",  "#00FFFF");
   draw_point(mid_x_1, mid_y_1, "#00FFFF");
  }

  var mid_x_2 = center("point_list_2")["mid_x"];
  var mid_y_2 = center("point_list_2")["mid_y"];

  if(polygon_2) {
   draw_polygon("point_list_2", "#FFFF00");
   draw_points("point_list_2", "#7CFC00");
   draw_point(mid_x_2, mid_y_2, "#7CFC00");
  }
  else {
   draw_polygon("point_list_2", "#FFFF00");
   draw_points("point_list_2",  "#FFFF00");
   draw_point(mid_x_2, mid_y_2, "#FFFF00");
  }
}


// This function generates coordinates of center from list of polygon points
function center(point_list) {
 var max_x = window[point_list][0]['x'];
 var max_y = window[point_list][0]['y'];
 var min_x = window[point_list][0]['x'];
 var min_y = window[point_list][0]['y'];
 for(var i = 0; i < window[point_list].length; i++) {
  if (window[point_list][i]['x'] > max_x) { max_x = window[point_list][i]['x']; }
  if (window[point_list][i]['x'] < min_x) { min_x = window[point_list][i]['x']; }
  if (window[point_list][i]['y'] > max_y) { max_y = window[point_list][i]['y']; }
  if (window[point_list][i]['y'] < min_y) { min_y = window[point_list][i]['y']; }
 }
 var mid_x = (min_x + max_x)/2;
 var mid_y = (min_y + max_y)/2;
 return {"mid_x": mid_x, "mid_y":mid_y};
}

function init() {
  initial_point_gen();
  return setInterval(draw, 10);
}

window.onload = function() {
    document.getElementById("FileName").innerHTML = "drishtiGS_001";
    document.getElementById("ImageCount").innerHTML = count+1;
    cxt0.drawImage(first_img, 0, 0);
    document.getElementById("cover").style.display = "block";
}

init();

canvas0.onmousedown = myDown;
canvas0.onmouseup = myUp;
canvas0.onmousemove = myMove;

function send(json_obj) {
    var xhr = new XMLHttpRequest();

    // URL to be changed later
    xhr.open("POST", "./api/sheet/write/", false);
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.setRequestHeader("Content-Type", "application/json, charset=UTF-8");
    xhr.send(JSON.stringify(json_obj));
    xhr.onreadystatechange = processRequest;

    function processRequest(e) {
        if (xhr.readyState == 4) {
            console.log(xhr.responseText);
        }
    }
    return
}
