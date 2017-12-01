var bg;
var chara;
var gazer=1;
function preload()
{
  bg = loadImage("source/background.png");
  chara = new Animation("source/hartstein-",180);
}
function setup()
{
  createCanvas(1400,900);
  chara.before=millis();
}
function draw()
{
  image(bg,0,0);
  chara.setSpeed(3-0.25*gazer);
  chara.displayShuttle(1001,500);
}

function Animation(prefix, count)
{
	this.sprite=[];
	this.imageCount=count;
	for(var i=0;i<this.imageCount;i++)
	{
		var filename=prefix+(i+1)+".png";
		this.sprite[i]=loadImage(filename);
	}
	this.frame=0;
	this.width=780;
	this.height=900;
	this.fps=60;
	this.before=0;
	this.display=function(x,y)
	{
		this.frame=(this.frame+int((millis()-this.before)*this.fps/1000))%this.imageCount;
		image(this.sprite[this.frame],x-this.width/2,y-this.height/2);
		this.before=millis();
	}
  this.displayShuttle=function(x,y)
  {
    this.frame=(this.frame+int((millis()-this.before)*this.fps/1000))%(this.imageCount*2);
    var real=this.frame;
    if(real>=this.imageCount) real=this.imageCount*2-1-real;
    var ele=10/8100;
    if(real<91) ele*=0.5*(real*real+real);
    else ele*=0.5*(real*real+real)+354;
    image(this.sprite[real],x-this.width/2,y-this.height/2+ele);
		this.before=millis();
  }
	this.setSpeed=function(n)
	{
		this.fps=60*n;
	}
}
