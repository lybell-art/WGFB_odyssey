var bg;
var chara;
var face;
var gazer=1;
var gazerBefore=1;
var slider;
//face detect
var detector;
var classifier = objectdetect.frontalface;
var cam;
var w=320;
var h=240;
var img;
function preload()
{
	bg = loadImage("source/background.png");
	chara = new Animation("source/hartstein-",180);
	face = new Face("source/face-");
}
function setup()
{
	createCanvas(1400,900);
	chara.before=millis();
	slider=createSlider(0,8,1,1);
	slider.position(10,10);
	var scaleFactor=1.0;
	detector=new objectdetect.detector(width,height,scaleFactor, classifier);
	cam=createCapture(VIDEO);
	cam.size(width,height);
	img=new p5.Image(width,height);
}
function draw()
{
	img.copy(cam,0,0,width,height,0,0,width,height);
    	var faces=detector.detect(img.canvas);
//	gazer=slider.value();
	gazer=constrain(faces.length,0,8);
	console.log(gazer);
	var cha_ypos;
	background(255);
	image(bg,0,0);
	chara.setSpeed(3-0.25*gazer);
	cha_ypos=chara.displayShuttle(1001,500);
	face.sweep();
	face.display(1001,500+cha_ypos);
	gazerBefore=gazer;
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
		return ele;
	}
	this.setSpeed=function(n)
	{
		this.fps=60*n;
	}
}

function Face(prefix)
{
	this.sprite=[];
	this.imageCount=61;
	for(var i=0;i<this.imageCount;i++)
	{
		var filename=prefix+(i+1)+".png";
		this.sprite[i]=loadImage(filename);
	}
	this.frame=0;
	this.width=780;
	this.height=900;
	this.status=0;
	this.direction=0;
	this.display=function(x,y)
	{
		image(this.sprite[this.frame],x-this.width/2,y-this.height/2);
	}
	this.sweep=function()
	{
		var p=gazer-gazerBefore;
		if(p>0) p=1;
		else if(p<0) p=-1;
		else p=0;
		if(p==1)
		{
			if(gazer>=6&&gazerBefore<6)
			{
				this.status=60;
				this.direction=1;
			}
			else if(gazer>=3&&gazerBefore<3)
			{
				this.status=30;
				this.direction=1;
			}
		}
		else if(p==-1)
		{
			if(gazer<3&&gazerBefore>=3)
			{
				this.status=0;
				this.direction=-1;
			}
			else if(gazer<6&&gazerBefore>=6)
			{
				this.status=30;
				this.direction=-1;
			}
		}
		if(this.frame!=this.status) this.frame+=this.direction;
		else this.direction=0;
	}
}
