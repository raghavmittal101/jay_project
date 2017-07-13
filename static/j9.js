
var canvas0 = document.getElementById('myCanvas0');
var cxt = canvas0.getContext('2d');

var canvas1 = document.getElementById('myCanvas_1');
var cxt_1 = canvas1.getContext('2d');

var point_list = [];

var dragok = false;
var drag_cent = false;
var startX;
var startY;

var BB = canvas0.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;

var point_show = true;

var count = 0;

var max_x, max_y, min_x, min_y, mid_x, mid_y;

var image_path = getPath();
var first_img = document.createElement
var first_img = document.createElement("img");
first_img.src = image_path + img_array[0];

function Save() {
    // TAKE THIS JSON AND STORE
    var json_obj = {"id": img_array[count], "list": point_list};
    document.getElementById('save-btn').disabled = true;
    document.getElementById('save-btn').innerText = "Saving...";
    send(json_obj);
    console.log(JSON.stringify(json_obj));
    document.getElementById('save-btn').disabled = false;
    document.getElementById('save-btn').innerText = "Save";
    return;
}

function Previous() {
    document.getElementById('next-btn').disabled = true;
    document.getElementById('loader').style.display = 'inline-block';
    count = count - 1;
    var img = new Image();
    img.src = image_path + img_array[count]
    img.onload = function(){
        cxt_1.clearRect(0, 0, canvas0.width, canvas0.height);
        cxt_1.drawImage(img, 0, 0);
        document.getElementById("FileName").innerHTML = img_array[count];
        document.getElementById('loader').style.display = 'none';
        document.getElementById('next-btn').disabled = false;
    };
}

function Next() {
    document.getElementById('next-btn').disabled = true;
    document.getElementById('loader').style.display = 'inline-block';
    count = count + 1;
    var img = new Image();
    img.src = image_path + img_array[count]
    img.onload = function(){
        cxt_1.clearRect(0, 0, canvas0.width, canvas0.height);
        cxt_1.drawImage(img, 0, 0);
        document.getElementById("FileName").innerHTML = img_array[count];
        document.getElementById('loader').style.display = 'none';
        document.getElementById('next-btn').disabled = false;
    };
}



function Hide() {point_show = false;}

function Show() {point_show = true;}

function scale(factor) {

    var x_before = mid_x;
    var y_before = mid_y;

    for (var i = 0; i < point_list.length; i++) {
        point_list[i]['x'] = point_list[i]['x'] * factor;
        point_list[i]['y'] = point_list[i]['y'] * factor;
    }

    draw_cent();

    var x_dif = mid_x - x_before;
    var y_dif = mid_y - y_before;

    for (var i = 0; i < point_list.length; i++) {
        point_list[i]['x'] = point_list[i]['x'] - x_dif;
        point_list[i]['y'] = point_list[i]['y'] - y_dif;
    }

}

function ScaleDown() {scale(.99);}

function ScaleUp() {scale(1.01);}

function draw_cent() {
    max_x = point_list[0]['x'];
    max_y = point_list[0]['y'];
    min_x = point_list[0]['x'];
    min_y = point_list[0]['y'];
    for (var i = 0; i < point_list.length; i++) {
        if (point_list[i]['x'] > max_x) {
            max_x = point_list[i]['x'];
        }
        if (point_list[i]['x'] < min_x) {
            min_x = point_list[i]['x'];
        }
        if (point_list[i]['y'] > max_y) {
            max_y = point_list[i]['y'];
        }
        if (point_list[i]['y'] < min_y) {
            min_y = point_list[i]['y'];
        }
    }
    mid_x = (min_x + max_x) / 2;
    mid_y = (min_y + max_y) / 2;
}

function draw_point(c1_x, c1_y, style) {
    var canvas0 = document.getElementById('myCanvas0');
    var cxt = canvas0.getContext('2d');
    cxt.beginPath();
    cxt.strokeStyle = style;
    cxt.arc(c1_x, c1_y, 5, 0, 2 * Math.PI, false);
    cxt.lineWidth = 5;
    cxt.stroke();
}

function draw_quad(x_m, y_m, prev_x, prev_y, x_1, y_1, style) {
    var canvas0 = document.getElementById('myCanvas0');
    var cxt = canvas0.getContext('2d');
    cxt.beginPath();
    cxt.strokeStyle = style;
    cxt.moveTo(x_m, y_m);
    cxt.quadraticCurveTo(prev_x, prev_y, x_1, y_1);
    cxt.lineWidth = 2;
    cxt.stroke();
}

function draw_line(x_m, y_m, prev_x, prev_y, x_1, y_1, style) {
    var canvas0 = document.getElementById('myCanvas0');
    var cxt = canvas0.getContext('2d');
    cxt.beginPath();
    cxt.strokeStyle = style;
    cxt.moveTo(x_m, y_m);
    cxt.lineTo(x_1, y_1);
    cxt.lineWidth = 2;
    cxt.stroke();
}

var numberOfSides = 16,
    size = 200,
    Xcenter = 300,
    Ycenter = 300;

prev_x = Xcenter + size * Math.cos(0);
prev_y = Ycenter + size * Math.sin(0);

for (var i = 0; i < numberOfSides; i = i + 1) {
    var x_1 = Xcenter + size * Math.cos((i + 1) * 2 * Math.PI / numberOfSides);
    var y_1 = Ycenter + size * Math.sin((i + 1) * 2 * Math.PI / numberOfSides);
    if (i == 0) {
        point_list.push({
            'x': (prev_x + x_1) / 2,
            'y': (prev_y + y_1) / 2,
            'drag': false
        });
    } else {
        point_list.push({
            'x': (point_list[(i * 2) - 1]['x'] + x_1) / 2,
            'y': (point_list[(i * 2) - 1]['y'] + y_1) / 2,
            'drag': false
        });
    }
    point_list.push({
        'x': x_1,
        'y': y_1,
        'drag': false
    });
}

point_list.unshift({
    'x': prev_x,
    'y': prev_y,
    'drag': false
})

function draw_polygon() {
    cxt.clearRect(0, 0, canvas0.width, canvas0.height)
    for (var i = 1; i < point_list.length - 1; i = i + 2) {
        draw_line(point_list[i - 1]['x'], point_list[i - 1]['y'], point_list[i]['x'], point_list[i]['y'], point_list[i + 1]['x'], point_list[i + 1]['y'], '#0000FF');
    }
    if (point_show) {
        for (var i = 0; i < point_list.length; i = i + 1) {
            if(i%2 == 0)
            {draw_point(point_list[i]['x'], point_list[i]['y'], '#000000');}
        }
        draw_cent();
        draw_point(mid_x, mid_y, '#ff0000');
    }
}

function myDown(e) {
    var mx = parseInt(e.pageX - offsetX);
    var my = parseInt(e.pageY - offsetY);
    dragok = false;
    if ((((mid_x - mx) * (mid_x - mx)) + ((mid_y - my) * (mid_y - my))) < 25) {
        drag_cent = true;
    } else {
        for (var i = 0; i < point_list.length; i = i + 1) {
            var sx = point_list[i]['x'];
            var sy = point_list[i]['y'];
            var dx = sx - mx;
            var dy = sy - my;
            if (dx * dx + dy * dy < 25) {
                dragok = true;
                point_list[i]['drag'] = true;

            }
        }
    }
    startX = mx;
    startY = my;
}

function myUp(e) {
    dragok = false;
    drag_cent = false;
    for (var i = 0; i < point_list.length; i++) {
        point_list[i]['drag'] = false;
    }
}

function myMove(e) {
    var mx = parseInt(e.pageX - offsetX);
    var my = parseInt(e.pageY - offsetY);
    var dx = mx - startX;
    var dy = my - startY;
    if (dragok) {
        for (var i = 0; i < point_list.length; i++) {
            var s = point_list[i];
            if (s['drag']) {
                s['x'] += dx;
                s['y'] += dy;
            }
        }
    }
    if (drag_cent) {
        for (var i = 0; i < point_list.length; i++) {
            point_list[i]['x'] += dx;
            point_list[i]['y'] += dy;
        }
    }
    draw_polygon();
    startX = mx;
    startY = my;
}

function init() {
    return setInterval(draw_polygon, 10);
}

window.onload = function() {
    document.getElementById("FileName").innerHTML = "drishtiGS_001";
    cxt_1.drawImage(first_img, 0, 0);
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
