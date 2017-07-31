////OBJ////////OBJ////////OBJ////////OBJ////////OBJ////////OBJ////
function Canvas(Init_o){
    this.init = function(id){
        this.id = id;
        this.element = document.getElementById(this.id);
        this.cxt = this.element.getContext('2d');
    };
    this.clear = function() {
        this.cxt.clearRect(0, 0, this.element.width, this.element.height);
    };

    this.drawPoint = function(x, y, style) {
        this.cxt.beginPath();
        this.cxt.strokeStyle =  style;
        this.cxt.arc(x, y, 5, 0, 2 * Math.PI, false);
        this.cxt.lineWidth = 3;
        this.cxt.stroke();
    };

    this.drawCenter = function(points, style){
        this.drawPoint(points.list.center_x, points.list.center_y, style);
    };

    this.drawPointList = function(points, style) {
        for(var i = 0; i <points.list.length; i = i + 1) {
            this.drawPoint(points.list[i]['x'], points.list[i]['y'], style);
        }
    };

    this.drawLine = function(x0, y0, x1, y1, style) {
        this.cxt.beginPath();
        this.cxt.strokeStyle = style;
        this.cxt.moveTo(x0, y0);
        this.cxt.lineTo(x1, y1);
        this.cxt.stroke();
    };
    this.drawPolygon = function(points, style) {
        for (var i = 0; i <  points.list.length-1; i = i + 1) {
            this.drawLine(points.list[i]['x'], points.list[i]['y'], points.list[i+1]['x'], points.list[i+1]['y'], style);
        }
    };

    this.drawFullFigure = function(point1, point2, polygon_num) {
        this.clear();
        
        point1.updateCenter();

        if(polygon_num == 1) {
            this.drawPolygon(point1, "#00FFFF");
            this.drawPointList(point1, "#7CFC00");
            this.drawCenter(point1, "#7CFC00");
        }
        else {
            this.drawPolygon(point1, "#00FFFF");
            this.drawPointList(point1,  "#00FFFF");
            this.drawCenter(point1, "#00FFFF");
        }

        point2.updateCenter();

        if(polygon_num == 2) {
            this.drawPolygon(point2, "#FFFF00");
            this.drawPointList(point2, "#7CFC00");
            this.drawCenter(point2, "#7CFC00");
        }
        else {
            this.drawPolygon(point2, "#FFFF00");
            this.drawPointList(point2,  "#FFFF00");
            this.drawCenter(point2, "#FFFF00");
        }
    };

    this.drawImage = function(){
        var first_img = document.createElement("img");
        first_img.src = Init_o.image_path + Init_o.image_list[Init_o.counter];
        this.cxt.drawImage(first_img, 0, 0);
    };
}

function Points(Init_o){
    this.list = [];
    this.init = function(){
        this.no_of_sides = 18;
        this.size = 200;
        this.center_x = 300;
        this.center_y = 300;
        this.generateList(18, 200, 300, 300);
    };
    this.init = function(no_of_sides, size, center_x, center_y){
        this.no_of_sides = no_of_sides;
        this.size = size;
        this.center_x = center_x;
        this.center_y = center_y;
        this.generateList();
    };
    this.generateList = function() {
        for (var i = 0; i <  this.no_of_sides; i = i + 1) {
            var x_1 =  this.center_x + this.size * Math.cos(i * 2 * Math.PI / this.no_of_sides);
            var y_1 =  this.center_y + this.size * Math.sin(i * 2 * Math.PI / this.no_of_sides);
            this.list.push({'x':x_1, 'y':y_1, 'drag':false});
        }
        this.list.push({'x': this.list[0]['x'], 'y': this.list[0]['y'], 'drag': false});
    };

    // This function generates coordinates of center from list of polygon points
    this.updateCenter = function() {
        var max_x = this.list[0].x;
        var max_y = this.list[0].y;
        var min_x = this.list[0].x;
        var min_y = this.list[0].y;
        for(var i = 0; i < this.list.length; i++) {
            if (this.list[i]['x'] > max_x) { max_x = this.list[i]['x']; }
            if (this.list[i]['x'] < min_x) { min_x = this.list[i]['x']; }
            if (this.list[i]['y'] > max_y) { max_y = this.list[i]['y']; }
            if (this.list[i]['y'] < min_y) { min_y = this.list[i]['y']; }
        }
        this.center_x = (min_x + max_x)/2;
        this.center_y = (min_y + max_y)/2;
    };

}

function User(Init_o){
    this.userDetails = [];
    this.getDetails = function(){
        if(document.getElementById("tnc-check").checked &&
        !document.getElementById("email-input").validity.typeMismatch &&
        !document.getElementById("email-input").validity.valueMissing &&
        !document.getElementById("name-input").validity.valueMissing){
            this.username = document.getElementById("name-input").value;
            this.email = document.getElementById("email-input").value;
            this.userDetails.push(this.username); 
          	this.userDetails.push(this.email);
            console.log(this.userDetails);
            document.getElementById("cover").remove();
        }
    };
}

function UI(Init_o, User_o){

    this.scrollToMiddle = function(){
        window.scrollTo(window.scrollMaxX/2, window.scrollMaxY/2);
    };
    this.save = function() {
        // TAKE THIS JSON AND STORE
        var list = [];
        var json_obj = {"id": Init_o.image_list[count], "user_info": User_o.userDetails, "list": list.concat(Init_o.point1.list, Init_o.point2.list)};
        document.getElementById('save-btn').disabled = true;
        document.getElementById('save-btn').innerText = "Saving...";
        send(json_obj);
        console.log(JSON.stringify(json_obj));
        document.getElementById('save-btn').disabled = false;
        document.getElementById('save-btn').innerText = "Save";
        return;
    };

    this.myDown = function(e) {

        var mx = parseInt(e.pageX-Init_o.offsetX);
        var my = parseInt(e.pageY-Init_o.offsetY);

        Init_o.dragok = false;
        
        Init_o.point1.updateCenter();
        if(Math.pow((Init_o.point1.center_x - mx), 2) + Math.pow((Init_o.point1.center_x - my), 2) < 25) {
            Init_o.polygon = 1
            Init_o.drag_cent_1 = true;
        }
        for(var i = 0;i < Init_o.point1.list.length; i = i + 1) {
            var sx = Init_o.point1.list[i].x;
            var sy = Init_o.point1.list[i].y;
            var dx = sx - mx;
            var dy = sy - my;
            if(dx*dx + dy*dy < 25) {
                Init_o.polygon = 1;
                Init_o.dragok = true;
                Init_o.point1.list[i].drag = true;
            }
        }

        Init_o.point2.updateCenter();
        if(Math.pow((Init_o.point2.center_x - mx), 2) + Math.pow((Init_o.point2.center_y - my), 2) < 25) {
            Init_o.polygon =  2;
            Init_o.drag_cent_2 = true;
        }
        for(var i = 0;i < Init_o.point2.list.length; i = i + 1) {
            var sx = Init_o.point2.list[i].x;
            var sy = Init_o.point2.list[i].y;
            var dx = sx - mx;
            var dy = sy - my;
            if(dx*dx + dy*dy < 25) {
                Init_o.polygon =  2;
                Init_o.dragok = true;
                Init_o.point2.list[i].drag = true;
            }
        }

        Init_o.startX = mx;
        Init_o.startY = my;
    };

    this.myUp = function(e) {
        Init_o.dragok = false;
        for(var i=0; i<Init_o.point1.list.length; i++) {
            Init_o.point1.list[i]['drag']=false;
        }
        for(var i=0;i<Init_o.point2.list.length;i++) {
            Init_o.point2.list[i]['drag']=false;
        }
        Init_o.drag_cent_1 = false;
        Init_o.drag_cent_2 = false;
    };


    this.myMove = function(e) {
        var mx = parseInt(e.pageX-Init_o.offsetX);
        var my = parseInt(e.pageY-Init_o.offsetY);
        var dx = mx-Init_o.startX;
        var dy = my-Init_o.startY;
        if (Init_o.dragok) {
            for(var i=0;i < Init_o.point1.list.length;i++) {
                var s1 = Init_o.point1.list[i];
                if(s1['drag']) {
                    s1['x']+=dx;
                    s1['y']+=dy;
                }
            }
            for(var i=0;i < Init_o.point2.list.length;i++) {
                var s2 = Init_o.point2.list[i];
                if(s2['drag']) {
                    s2['x']+=dx;
                    s2['y']+=dy;
                }
            }
        }
        if(Init_o.drag_cent_1) {
            for(var i = 0; i < Init_o.point1.list.length; i++) {
                Init_o.point1.list[i]['x'] += dx;
                Init_o.point1.list[i]['y'] += dy;
            }
        }

        if(Init_o.drag_cent_2) {
            for(var i = 0; i < Init_o.point2.list.length; i++) {
                Init_o.point2.list[i]['x'] += dx;
                Init_o.point2.list[i]['y'] += dy;
            }
        }

        Init_o.startX = Init_o.mx;
        Init_o.startY = Init_o.my;
    };

    this.scale = function (factor, point) {
        point.updateCenter()
        var x_before = point.list.center_x;
        var y_before = point.list.center_y;
        for(var i = 0; i < point.list.length; i++) {
        point.list[i]['x'] = point.list[i]['x'] * factor;
        point.list[i]['y'] = point.list[i]['y'] * factor;
        }
    
        point.updateCenter()
        var x_dif = point.list.center_x - x_before;
        var y_dif = point.list.center_y - y_before;
        for(var i = 0; i < point.list.length; i++) {
            point.list[i]['x'] = point.list[i]['x'] - x_dif;
            point.list[i]['y'] = point.list[i]['y'] - y_dif;
        }
    };

    this.scaleDown = function()   {
        if(Init_o.polygon == 1) {
            this.scale(.99, Init_o.point1);
        }
        else if (Init_o.polygon == 2) {
            this.scale(.99, Init_o.point2);
        }
    };

    this.scaleUp = function()   {
        if(Init_o.polygon == 1) {
            this.scale(1.01, Init_o.point1);
        }
        else if (Init_o.polygon == 2) {
            this.scale(1.01, Init_o.point2);
        }
    };

    this.loadImage = function(button_id, button_text){
        /*
            Load new image in canvas.

            button_id: `ID` attribute of the button which will trigger the action.
            button_text: Inner text of button like 'Previous', 'Next'.
            image_list: List of names of all the images to be shown.
            image_path: Path to be prepended to each name of image which will link source with proper location.
            count: Count is the position of image in image_name list which is to be loaded in canvas.
        */
        document.getElementById(button_id).disabled = true;
        document.getElementById(button_id).innerText = 'Loading';
        var img = new Image();
        img.src = Init_o.image_path + Init_o.image_list[Init_o.counter];
        this.scrollToMiddle();
        img.onload = function(){
            Init_o.image_canvas.clear();
            Init_o.image_canvas.drawImage(img, 0, 0);
            document.getElementById("FileName").innerHTML = Init_o.image_list[Init_o.counter];
            document.getElementById("ImageCount").innerHTML = Init_o.counter+1;
            document.getElementById(button_id).innerText = button_text;
            document.getElementById(button_id).disabled = false;
        };
    };

    this.Previous = function(){
        if(Init_o.counter == 0){return null;}
        else Init_o.counter = Init_o.counter - 1;
        this.loadImage('prev-btn', 'Previous')
    };

    this.Next = function() {
        Init_o.counter = Init_o.counter + 1;
        this.loadImage('next-btn', 'Next')
    };

    this.send = function(json_obj) {
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
    };
}

function Init(){

    this.counter = 0;
    this.polygon = 1;
    this.image_path = getPath();
    this.image_list = ['drishtiGS_094.png', 'drishtiGS_026.png', 'drishtiGS_075.png', 'drishtiGS_081.png', 
    'drishtiGS_084.png', 'drishtiGS_031.png', 'drishtiGS_098.png', 'drishtiGS_036.png', 'drishtiGS_051.png', 
    'drishtiGS_045.png', 'drishtiGS_080.png', 'drishtiGS_047.png', 'drishtiGS_060.png', 'drishtiGS_035.png', 
    'drishtiGS_008.png', 'drishtiGS_057.png', 'drishtiGS_017.png', 'drishtiGS_076.png', 'drishtiGS_024.png', 
    'drishtiGS_012.png', 'drishtiGS_032.png', 'drishtiGS_037.png', 'drishtiGS_062.png', 'drishtiGS_068.png', 
    'drishtiGS_042.png', 'drishtiGS_002.png', 'drishtiGS_101.png', 'drishtiGS_089.png', 'drishtiGS_022.png', 
    'drishtiGS_061.png', 'drishtiGS_069.png', 'drishtiGS_046.png', 'drishtiGS_033.png', 'drishtiGS_090.png', 
    'drishtiGS_049.png', 'drishtiGS_004.png', 'drishtiGS_092.png', 'drishtiGS_063.png', 'drishtiGS_016.png', 
    'drishtiGS_041.png', 'drishtiGS_044.png', 'drishtiGS_058.png', 'drishtiGS_088.png', 'drishtiGS_064.png'];

    this.point1 = new Points(this);
    this.point1.init(18, 200, 300, 300);

    this.point2 = new Points(this);
    this.point2.init(14, 150, 500, 500);

    this.image_canvas = new Canvas(this);
    this.image_canvas.init('myCanvas0');

    this.point_canvas = new Canvas(this);
    this.point_canvas.init('myCanvas_1');

    this.image_canvas.drawImage();

    this.dragok = false;
    this.drag_cent_1 = false;
    this.drag_cent_2 = false;    
    var BB = this.point_canvas.element.getBoundingClientRect();
    this.offsetX = BB.left;
    this.offsetY = BB.top;
    this.startX;
    this.startY;

    return setInterval(this.point_canvas.drawFullFigure(this.point1, this.point2, this.polygon), 10);
}


    var count;
    var ini = new Init();
    var user = new User(ini);
    var ui = new UI(ini, user);
    ini.point_canvas.element.onmousedown = ui.myDown();
    ini.point_canvas.element.onmouseup = ui.myUp();
    ini.point_canvas.element.onmousemove = ui.myMove();
    count = ini.counter;
    function Save(){ ui.save(); }
    function Next(){ count = ini.counter; ui.Next(); }
    function Previous(){ count = ini.counter; ui.Previous(); }
    function ScaleDown(){ ui.scaleDown(); }
    function ScaleUp(){ ui.scaleUp(); }
    function getDetails(){ user.getDetails(); }




////OBJ////////OBJ////////OBJ////////OBJ////////OBJ////////OBJ////

