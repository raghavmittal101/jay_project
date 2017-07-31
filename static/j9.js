var count = 0;
var canvas0 = document.getElementById('myCanvas_1');
var cxt = canvas0.getContext('2d');

var canvas1 = document.getElementById('myCanvas0');
var cxt0 = canvas1.getContext('2d');

var image_path = getPath();
var image_list = 
[
    ['drishtiGS_094.png', 'drishtiGS_026.png', 'drishtiGS_075.png', 'drishtiGS_081.png', 'drishtiGS_084.png', 
    'drishtiGS_031.png', 'drishtiGS_098.png', 'drishtiGS_036.png', 'drishtiGS_051.png', 'drishtiGS_045.png', 
    'drishtiGS_080.png'], 

    ['drishtiGS_047.png', 'drishtiGS_060.png', 'drishtiGS_035.png', 'drishtiGS_008.png', 'drishtiGS_057.png', 
    'drishtiGS_017.png', 'drishtiGS_076.png', 'drishtiGS_024.png', 'drishtiGS_012.png', 'drishtiGS_032.png', 
    'drishtiGS_037.png'], 

    ,['drishtiGS_062.png', 'drishtiGS_068.png', 'drishtiGS_042.png', 'drishtiGS_002.png', 'drishtiGS_101.png', 
    'drishtiGS_089.png', 'drishtiGS_022.png', 'drishtiGS_061.png', 'drishtiGS_069.png', 'drishtiGS_046.png', 
    'drishtiGS_033.png']

    ,['drishtiGS_090.png', 'drishtiGS_049.png', 'drishtiGS_004.png', 'drishtiGS_092.png', 'drishtiGS_063.png', 
    'drishtiGS_016.png', 'drishtiGS_041.png', 'drishtiGS_044.png', 'drishtiGS_058.png', 'drishtiGS_088.png', 
    'drishtiGS_064.png']
];

console.log(image_list);
//var first_img = document.createElement
//var first_img = document.createElement("img");
//first_img.src = image_path + image_list[setNum][count];
//cxt0.drawImage(first_img, 0, 0);

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

var setNum = 0; // by default
var userDetails;

function scrollToMiddle(){
    window.scrollTo(window.scrollMaxX/2, window.scrollMaxY/2);
    return;
}

function Save() {
    // TAKE THIS JSON AND STORE
    var list = [];
    var json_obj = {"id": image_list[setNum][count], "user_info": userDetails, "list": list.concat(point_list_1, point_list_2)};
    document.getElementById('save-btn').disabled = true;
    document.getElementById('save-btn').innerText = "Saving...";
    send(json_obj);
    console.log(JSON.stringify(json_obj));
    document.getElementById('save-btn').disabled = false;
    document.getElementById('save-btn').innerText = "Save";
    return;
}

function loadImage(button_id, button_text, image_list, image_path, count, setNum){
    /*
        Load new image in canvas.

        button_id: `ID` attribute of the button which will trigger the action.
        button_text: Inner text of button like 'Previous', 'Next'.
        image_list: List of names of all the images to be shown.
        image_path: Path to be prepended to each name of image which will link source with proper location.
        count: Count is the position of image in image_name list which is to be loaded in canvas.
    */
    checkButtonValidity();
    document.getElementById(button_id).disabled = true;
    document.getElementById(button_id).innerText = 'Loading';
    var img = new Image();
    img.src = image_path + image_list[setNum][count];
    scrollToMiddle();
    img.onload = function(){
        cxt0.clearRect(0, 0, canvas0.width, canvas0.height);
        cxt0.drawImage(img, 0, 0);
        document.getElementById("FileName").innerHTML = image_list[setNum][count];
        document.getElementById("ImageCount").innerHTML = count+1;
        document.getElementById(button_id).innerText = button_text;
        document.getElementById(button_id).disabled = false;   
        checkButtonValidity();
        loadPointsFromDict();
    };
    
}

function checkButtonValidity(){
    if(count <= 0){document.getElementById('prev-btn').disabled = true;}
    else{document.getElementById('prev-btn').disabled = false;}
    if(count >= image_list[setNum].length-1){
        document.getElementById('next-btn').disabled = true; return null;}
    else{document.getElementById('next-btn').disabled = false;}
}

function Previous(){
	count = count - 1;
    loadImage('prev-btn', 'Previous', image_list, image_path, count, setNum);
}

function Next() {
    count = count + 1;
    loadImage('next-btn', 'Next', image_list, image_path, count, setNum);   
}


function clear() {
 var canvas0 = document.getElementById('myCanvas_1');
 var cxt = canvas0.getContext('2d');
 cxt.clearRect(0, 0, canvas0.width, canvas0.height);
}

function scale(factor, pt_list) {
 var x_before = center(pt_list)['mid_x'];
 var y_before = center(pt_list)['mid_y'];
 for(var i = 0; i < pt_list.length; i++) {
  pt_list[i]['x'] = pt_list[i]['x'] * factor;
  pt_list[i]['y'] = pt_list[i]['y'] * factor;
 }
 var x_dif = center(pt_list)['mid_x'] - x_before;
 var y_dif = center(pt_list)['mid_y'] - y_before;
 for(var i = 0; i < pt_list.length; i++) {
  pt_list[i]['x'] = pt_list[i]['x'] - x_dif;
  pt_list[i]['y'] = pt_list[i]['y'] - y_dif;
 }
}

function ScaleDown()   {
 if(polygon_1 == true) {
  scale(.99, point_list_1);
 }
 else if (polygon_2 == true) {
  scale(.99, point_list_2);
 }
}

function ScaleUp()   {
 if(polygon_1 == true) {
  scale(1.01, point_list_1);
 }
 else if (polygon_2 == true) {
  scale(1.01, point_list_2);
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
    for (var i = 0; i <  pt_list.length-1; i = i + 1) {
        draw_line(pt_list[i]['x'], pt_list[i]['y'], pt_list[i+1]['x'], pt_list[i+1]['y'], style);
    }
}

function draw_points(pt_list, style) {
    for(var i = 0; i < pt_list.length; i = i + 1) {
        draw_point(pt_list[i]['x'], pt_list[i]['y'], style);
    }
}

function myDown(e) {

 var mx = parseInt(e.pageX-offsetX);
 var my = parseInt(e.pageY-offsetY);

 dragok = false;

  if(Math.pow((center(point_list_1)['mid_x'] - mx), 2) + Math.pow((center(point_list_1)['mid_y'] - my), 2) < 25) {
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

   updatePointsDict();
  }

  if(Math.pow((center(point_list_2)['mid_x'] - mx), 2) + Math.pow((center(point_list_2)['mid_y'] - my), 2) < 25) {
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
 
 updatePointsDict();
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

 updatePointsDict();
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
 
 updatePointsDict();
}


function updatePointsDict(){
    image_dict[image_list[setNum][count]]['point_list_1'] = JSON.stringify(point_list_1);
    image_dict[image_list[setNum][count]]['point_list_2'] = JSON.stringify(point_list_2);
}

function initial_point_gen() {
 point_list_gen("point_list_1",18,200,300,300);
 point_list_gen("point_list_2",14,150,500,500);
}

function draw() {
  clear();
  var mid_x_1 = center(point_list_1)["mid_x"];
  var mid_y_1 = center(point_list_1)["mid_y"];

  if(polygon_1) {
   draw_polygon(point_list_1, "#00FFFF");
   draw_points(point_list_1, "#7CFC00");
   draw_point(mid_x_1, mid_y_1, "#7CFC00");
  }
  else {
   draw_polygon(point_list_1, "#00FFFF");
   draw_points(point_list_1,  "#00FFFF");
   draw_point(mid_x_1, mid_y_1, "#00FFFF");
  }

  var mid_x_2 = center(point_list_2)["mid_x"];
  var mid_y_2 = center(point_list_2)["mid_y"];

  if(polygon_2) {
   draw_polygon(point_list_2, "#FFFF00");
   draw_points(point_list_2, "#7CFC00");
   draw_point(mid_x_2, mid_y_2, "#7CFC00");
  }
  else {
   draw_polygon(point_list_2, "#FFFF00");
   draw_points(point_list_2,  "#FFFF00");
   draw_point(mid_x_2, mid_y_2, "#FFFF00");
  }
//   updatePointsDict();
}


// This function generates coordinates of center from list of polygon points
function center(point_list) {
    var max_x = point_list[0]['x'];
    var max_y = point_list[0]['y'];
    var min_x = point_list[0]['x'];
    var min_y = point_list[0]['y'];
    for(var i = 0; i < point_list.length; i++) {
        if (point_list[i]['x'] > max_x) { max_x = point_list[i]['x']; }
        if (point_list[i]['x'] < min_x) { min_x = point_list[i]['x']; }
        if (point_list[i]['y'] > max_y) { max_y = point_list[i]['y']; }
        if (point_list[i]['y'] < min_y) { min_y = point_list[i]['y']; }
    }
    var mid_x = (min_x + max_x)/2;
    var mid_y = (min_y + max_y)/2;
    return {"mid_x": mid_x, "mid_y":mid_y};
}

function init() {
  initial_point_gen();
  return setInterval(draw, 10);
}


function getDetails(){
    userDetails = [];
  if(document.getElementById("tnc-check").checked &&
    !document.getElementById("email-input").validity.typeMismatch &&
    !document.getElementById("email-input").validity.valueMissing &&
    !document.getElementById("name-input").validity.valueMissing){
    username = document.getElementById("name-input").value;
    email = document.getElementById("email-input").value;
    userDetails.push(username); userDetails.push(email);
    setNum = document.getElementById("set-num").value - 1;
    console.log(userDetails);
    console.log(setNum);
    document.getElementById("cover").remove();
            document.getElementById("totalImages").innerHTML = image_list[setNum].length;
        loadImage('next-btn', 'Next', image_list, image_path, count, setNum);
 
  }
}

window.onload = function() {

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

image_dict = {
        'drishtiGS_094.png':
            {
                'point_list_1' : '[{"x":1076,"y":818,"drag":false},{"x":1058,"y":893.4040286651338,"drag":false},{"x":1010.2088886237957,"y":939.5575219373079,"drag":false},{"x":957,"y":984.2050807568877,"drag":false},{"x":891.729635533386,"y":1007.9615506024415,"drag":false},{"x":822.270364466614,"y":1007.9615506024415,"drag":false},{"x":757,"y":984.2050807568878,"drag":false},{"x":703.7911113762043,"y":939.5575219373079,"drag":false},{"x":669.0614758428184,"y":879.4040286651338,"drag":false},{"x":657,"y":811,"drag":false},{"x":669.0614758428183,"y":742.5959713348662,"drag":false},{"x":703.7911113762043,"y":682.4424780626922,"drag":false},{"x":757,"y":637.7949192431123,"drag":false},{"x":822.270364466614,"y":614.0384493975585,"drag":false},{"x":891.729635533386,"y":614.0384493975583,"drag":false},{"x":957,"y":637.7949192431122,"drag":false},{"x":1010.2088886237957,"y":682.4424780626921,"drag":false},{"x":1060.9385241571817,"y":739.5959713348662,"drag":false},{"x":1076,"y":818,"drag":false}]',
                'point_list_2' : '[{"x":1013,"y":804,"drag":false},{"x":998.1453301853628,"y":869.0825608676337,"drag":false},{"x":956.52347027881,"y":921.2747223702045,"drag":false},{"x":896.3781400934472,"y":950.2391868272736,"drag":false},{"x":829.6218599065528,"y":950.2391868272736,"drag":false},{"x":769.47652972119,"y":921.2747223702045,"drag":false},{"x":727.8546698146372,"y":869.0825608676337,"drag":false},{"x":713,"y":804,"drag":false},{"x":727.8546698146372,"y":738.9174391323663,"drag":false},{"x":769.47652972119,"y":686.7252776297955,"drag":false},{"x":829.6218599065528,"y":657.7608131727264,"drag":false},{"x":896.378140093447,"y":657.7608131727264,"drag":false},{"x":956.52347027881,"y":686.7252776297955,"drag":false},{"x":998.145330185363,"y":738.9174391323663,"drag":false},{"x":1013,"y":804,"drag":false}]'
            },
        'drishtiGS_026.png':
            {
                'point_list_1' : '[{"x":1076,"y":818,"drag":false},{"x":1058,"y":893.4040286651338,"drag":false},{"x":1010.2088886237957,"y":939.5575219373079,"drag":false},{"x":957,"y":984.2050807568877,"drag":false},{"x":891.729635533386,"y":1007.9615506024415,"drag":false},{"x":822.270364466614,"y":1007.9615506024415,"drag":false},{"x":757,"y":984.2050807568878,"drag":false},{"x":703.7911113762043,"y":939.5575219373079,"drag":false},{"x":669.0614758428184,"y":879.4040286651338,"drag":false},{"x":657,"y":811,"drag":false},{"x":669.0614758428183,"y":742.5959713348662,"drag":false},{"x":703.7911113762043,"y":682.4424780626922,"drag":false},{"x":757,"y":637.7949192431123,"drag":false},{"x":822.270364466614,"y":614.0384493975585,"drag":false},{"x":891.729635533386,"y":614.0384493975583,"drag":false},{"x":957,"y":637.7949192431122,"drag":false},{"x":1010.2088886237957,"y":682.4424780626921,"drag":false},{"x":1060.9385241571817,"y":739.5959713348662,"drag":false},{"x":1076,"y":818,"drag":false}]',
                'point_list_2' : '[{"x":1013,"y":804,"drag":false},{"x":998.1453301853628,"y":869.0825608676337,"drag":false},{"x":956.52347027881,"y":921.2747223702045,"drag":false},{"x":896.3781400934472,"y":950.2391868272736,"drag":false},{"x":829.6218599065528,"y":950.2391868272736,"drag":false},{"x":769.47652972119,"y":921.2747223702045,"drag":false},{"x":727.8546698146372,"y":869.0825608676337,"drag":false},{"x":713,"y":804,"drag":false},{"x":727.8546698146372,"y":738.9174391323663,"drag":false},{"x":769.47652972119,"y":686.7252776297955,"drag":false},{"x":829.6218599065528,"y":657.7608131727264,"drag":false},{"x":896.378140093447,"y":657.7608131727264,"drag":false},{"x":956.52347027881,"y":686.7252776297955,"drag":false},{"x":998.145330185363,"y":738.9174391323663,"drag":false},{"x":1013,"y":804,"drag":false}]'
            },
        'drishtiGS_075.png':
            {
                'point_list_1' : '[{"x":1076,"y":818,"drag":false},{"x":1058,"y":893.4040286651338,"drag":false},{"x":1010.2088886237957,"y":939.5575219373079,"drag":false},{"x":957,"y":984.2050807568877,"drag":false},{"x":891.729635533386,"y":1007.9615506024415,"drag":false},{"x":822.270364466614,"y":1007.9615506024415,"drag":false},{"x":757,"y":984.2050807568878,"drag":false},{"x":703.7911113762043,"y":939.5575219373079,"drag":false},{"x":669.0614758428184,"y":879.4040286651338,"drag":false},{"x":657,"y":811,"drag":false},{"x":669.0614758428183,"y":742.5959713348662,"drag":false},{"x":703.7911113762043,"y":682.4424780626922,"drag":false},{"x":757,"y":637.7949192431123,"drag":false},{"x":822.270364466614,"y":614.0384493975585,"drag":false},{"x":891.729635533386,"y":614.0384493975583,"drag":false},{"x":957,"y":637.7949192431122,"drag":false},{"x":1010.2088886237957,"y":682.4424780626921,"drag":false},{"x":1060.9385241571817,"y":739.5959713348662,"drag":false},{"x":1076,"y":818,"drag":false}]',
                'point_list_2' : '[{"x":1013,"y":804,"drag":false},{"x":998.1453301853628,"y":869.0825608676337,"drag":false},{"x":956.52347027881,"y":921.2747223702045,"drag":false},{"x":896.3781400934472,"y":950.2391868272736,"drag":false},{"x":829.6218599065528,"y":950.2391868272736,"drag":false},{"x":769.47652972119,"y":921.2747223702045,"drag":false},{"x":727.8546698146372,"y":869.0825608676337,"drag":false},{"x":713,"y":804,"drag":false},{"x":727.8546698146372,"y":738.9174391323663,"drag":false},{"x":769.47652972119,"y":686.7252776297955,"drag":false},{"x":829.6218599065528,"y":657.7608131727264,"drag":false},{"x":896.378140093447,"y":657.7608131727264,"drag":false},{"x":956.52347027881,"y":686.7252776297955,"drag":false},{"x":998.145330185363,"y":738.9174391323663,"drag":false},{"x":1013,"y":804,"drag":false}]'
            },
        
        'drishtiGS_081.png' : 
            {
                'point_list_1' : '[{"x":1076,"y":818,"drag":false},{"x":1058,"y":893.4040286651338,"drag":false},{"x":1010.2088886237957,"y":939.5575219373079,"drag":false},{"x":957,"y":984.2050807568877,"drag":false},{"x":891.729635533386,"y":1007.9615506024415,"drag":false},{"x":822.270364466614,"y":1007.9615506024415,"drag":false},{"x":757,"y":984.2050807568878,"drag":false},{"x":703.7911113762043,"y":939.5575219373079,"drag":false},{"x":669.0614758428184,"y":879.4040286651338,"drag":false},{"x":657,"y":811,"drag":false},{"x":669.0614758428183,"y":742.5959713348662,"drag":false},{"x":703.7911113762043,"y":682.4424780626922,"drag":false},{"x":757,"y":637.7949192431123,"drag":false},{"x":822.270364466614,"y":614.0384493975585,"drag":false},{"x":891.729635533386,"y":614.0384493975583,"drag":false},{"x":957,"y":637.7949192431122,"drag":false},{"x":1010.2088886237957,"y":682.4424780626921,"drag":false},{"x":1060.9385241571817,"y":739.5959713348662,"drag":false},{"x":1076,"y":818,"drag":false}]',
                'point_list_2' : '[{"x":1013,"y":804,"drag":false},{"x":998.1453301853628,"y":869.0825608676337,"drag":false},{"x":956.52347027881,"y":921.2747223702045,"drag":false},{"x":896.3781400934472,"y":950.2391868272736,"drag":false},{"x":829.6218599065528,"y":950.2391868272736,"drag":false},{"x":769.47652972119,"y":921.2747223702045,"drag":false},{"x":727.8546698146372,"y":869.0825608676337,"drag":false},{"x":713,"y":804,"drag":false},{"x":727.8546698146372,"y":738.9174391323663,"drag":false},{"x":769.47652972119,"y":686.7252776297955,"drag":false},{"x":829.6218599065528,"y":657.7608131727264,"drag":false},{"x":896.378140093447,"y":657.7608131727264,"drag":false},{"x":956.52347027881,"y":686.7252776297955,"drag":false},{"x":998.145330185363,"y":738.9174391323663,"drag":false},{"x":1013,"y":804,"drag":false}]'
            }


};


function loadPointsFromDict(){
    clearInterval();
    polygon_1 = true;
    polygon_2 = true;

    if(image_dict[image_list[setNum][count]]){
    point_list_1 = JSON.parse(image_dict[image_list[setNum][count]]['point_list_1']);
    point_list_2 = JSON.parse(image_dict[image_list[setNum][count]]['point_list_2']);
    }

    setInterval(draw(), 10);

    polygon_1 = false;
    polygon_2 = false;
}