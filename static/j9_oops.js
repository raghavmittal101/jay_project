class Canvas(){
    constructor(){
        this.canvas0 = document.getElementById('myCanvas0');
        this.cxt = canvas0.getContext('2d');

        this.canvas1 = document.getElementById('myCanvas1');
        this.cxt0 = canvas1.getContext('2d');
    }

    function render(){}
    function load(){}
}
class Image(){
    this.path = getPath();
    this.list = [
        'drishtiGS_094.png', 'drishtiGS_026.png', 'drishtiGS_075.png', 'drishtiGS_081.png', 
        'drishtiGS_084.png', 'drishtiGS_031.png', 'drishtiGS_098.png', 'drishtiGS_036.png', 
        'drishtiGS_051.png', 'drishtiGS_045.png', 'drishtiGS_080.png', 'drishtiGS_047.png', 
        'drishtiGS_060.png', 'drishtiGS_035.png', 'drishtiGS_008.png', 'drishtiGS_057.png', 
        'drishtiGS_017.png', 'drishtiGS_076.png', 'drishtiGS_024.png', 'drishtiGS_012.png', 
        'drishtiGS_032.png', 'drishtiGS_037.png', 'drishtiGS_062.png', 'drishtiGS_068.png', 
        'drishtiGS_042.png', 'drishtiGS_002.png', 'drishtiGS_101.png', 'drishtiGS_089.png', 
        'drishtiGS_022.png', 'drishtiGS_061.png', 'drishtiGS_069.png', 'drishtiGS_046.png', 
        'drishtiGS_033.png', 'drishtiGS_090.png', 'drishtiGS_049.png', 'drishtiGS_004.png', 
        'drishtiGS_092.png', 'drishtiGS_063.png', 'drishtiGS_016.png', 'drishtiGS_041.png', 
        'drishtiGS_044.png', 'drishtiGS_058.png', 'drishtiGS_088.png', 'drishtiGS_064.png'];
    function next(){}
    function prev(){}
}
class Data(){
    function send(){}
    function save(){}
    function load(){}
}