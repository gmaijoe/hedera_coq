/**
 * Created by gmaister on 3/5/15.
 */
function Tagger(outerdiv, innerdiv, xval, yval, height, width){
    this.isMouseDown = false;

    this.outdiv = document.getElementById(outerdiv);
    this.indiv = document.getElementById(innerdiv);
    var obj = this;

    this.outdiv.onmousedown = function(event) {
        obj.mouseDown(event);
    }

    this.xcord = document.getElementById(xval);
    this.ycord = document.getElementById(yval);
    this.width = document.getElementById(width);
    this.height = document.getElementById(height);
}

var img = document.getElementById("image"); // With this listener the image won't be dragged
img.addEventListener('mousedown', handler);
function handler(evt) {
    evt.preventDefault();
};

Tagger.prototype.mouseDown = function(event) {
    event.preventDefault();
    this.indiv.innerHTML = ""; //clear old div
    this.indiv.style.width = 0;
    this.indiv.style.height = 0;

    var x = this.indiv.style.left = (event.pageX - this.outdiv.offsetLeft) + "px";
    var y = this.indiv.style.top = (event.pageY - this.outdiv.offsetTop) + "px";

    this.indiv.style.visibility = "visible";
    this.indiv.style.border = "thin dashed black";

    this.xcord.value = x;
    this.ycord.value = y;

    var obj = this;
    //-----------------------------------------------------------------
    this.oldMoveHandler = this.outdiv.onmousemove;
    this.outdiv.onmousemove = function(event) { //what is document.body
        obj.mouseMove(event);
    }
    this.oldUpHandler = this.outdiv.onmouseup;
    this.outdiv.onmouseup = function(event) {
        obj.mouseUp(event);
    }
    //-----------------------------------------------------------------
    this.isMouseDown = true;
}

Tagger.prototype.mouseMove = function(event) {

    var img = document.getElementById("image");
    var imgwidth = (img.clientWidth) + "px";
    var imgheight = (img.clientHeight) + "px";
    var x = this.xcord.value;
    var y = this.ycord.value;

    var width = (parseInt(event.pageX) - parseInt(this.outdiv.offsetLeft) - parseInt(this.xcord.value));
    var height = (parseInt(event.pageY) - parseInt(this.outdiv.offsetTop) - parseInt(this.ycord.value));

    if (!this.isMouseDown) {
        return;
    }

    var indivwidth = (parseInt(this.indiv.style.width)  + parseInt(this.xcord.value)) + "px"; //to remain in boundaries
    var indivheight = (parseInt(this.indiv.style.height) + parseInt(this.ycord.value)) + "px"; //to remain in boundaries

    //if ((indivwidth <= imgwidth) || (indivheight <= imgheight)) {
    if (width < 0) { //width is negative
        this.indiv.style.left = (parseInt(this.xcord.value) - parseInt(Math.abs(width))) + "px";
        this.indiv.style.width = Math.abs(width) + "px";
    } else { //positive
        this.indiv.style.width = (width) + "px";
    }

    if (height < 0) { //height is negative
        this.indiv.style.top = (parseInt(y) - parseInt(Math.abs(height))) + "px";
        this.indiv.style.height = Math.abs(height) + "px";
    } else { //positive
        this.indiv.style.height = (height) + "px";
    }
    //}
}

Tagger.prototype.mouseUp = function(event) {
    this.isMouseDown = false;

    this.xcord.value  = this.indiv.style.left + "px";
    this.ycord.value = this.indiv.style.top + "px";

    var width = this.indiv.style.width + "px";
    var height = this.indiv.style.height + "px";

    //var width = (parseInt(event.pageX) - parseInt(this.outdiv.offsetLeft) - parseInt(this.xcord.value)) + "px";
    //var height = (parseInt(event.pageY) - parseInt(this.outdiv.offsetTop) - parseInt(this.ycord.value)) + "px";

    this.width.value = width; //setting hidden value field width
    this.height.value = height; //setting hidden value field height

    this.indiv.onmousemove = this.oldMoveHandler;
    this.indiv.onmouseup = this.oldUpHandler;
}