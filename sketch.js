/// Chameleon game sketch


let chameleon;
let fly;

let pink;
let green;

let flyImg;
let chamImg;

let score = 0;

function preload(){
	flyImg = loadImage("assets/fly.png");
	chamImg = loadImage("assets/chameleon.png");
}

function setup() {
	createCanvas(800,800);
	strokeWeight(10);
	textSize(20);
	noCursor();

	chameleon = new Chameleon(width-65,height-65);
	fly = new Fly(random(0,width),random(0,height),flyImg);

	pink = color("rgb(240,160,140)");
	green = color("rgb(150,210,100)")

}

function draw(){
		background(green);
    chameleon.display();
    fly.display();
		crossHair();
		text("Score: "+score,width*0.05,height*0.05);
}

function mousePressed(){
		chameleon.aim(mouseX,mouseY);
}


function crossHair(){
	push();
		strokeWeight(2);
		stroke(0);
		noFill();
		line(mouseX,mouseY-30,mouseX,mouseY+30);
		line(mouseX-30,mouseY,mouseX+30,mouseY);
		ellipse(mouseX,mouseY,60);
		ellipse(mouseX,mouseY,30);
	pop();
}

function Chameleon(X,Y){

    this.x = X;
    this.y = Y;

		this.tip = new Tip(this.x,this.y);


    this.display = ()=>{
				this.tip.display();
				this.tip.advance();
				this.tip.collide();
				image(chamImg,this.x-35,this.y-35);
    }

    this.aim = (aimX,aimY)=>{
				this.tip.fire(aimX,aimY);
    }

		function Tip(X,Y){
			this.origin = createVector(X,Y);
			this.pos = createVector(X,Y);
			this.size = 30;
			this.heading;
			this.speed = 0.05;
			this.stick;
			this.step;

			this.display = ()=>{
					push();
						stroke(pink);
						noFill();
						ellipse(this.pos.x,this.pos.y,this.size);
					pop();
			}

			this.fire = (X,Y)=>{
				if(this.pos.x == this.origin.x){
					this.heading = createVector(X-this.pos.x,Y-this.pos.y);
					this.step = this.heading.mult(this.speed);
					this.stick = false;
				}
			}
			this.backToOrigin = ()=>{
				this.heading = createVector(this.origin.x-this.pos.x,this.origin.y-this.pos.y);
				this.step = this.heading.mult(this.speed);
				this.stick = true;
			}

			this.advance = ()=>{
				this.pos = this.pos.add(this.step);
			}

			this.collide=()=>{
				// hitting edge of canvas
				if(	this.pos.x>width ||
						this.pos.x<0 ||
						this.pos.y<0 ||
						this.pos.y>height
					){
					this.backToOrigin();
					this.stick=true;
				}
				// stopping at origin and resetting to original position
				if(	this.pos.x>this.origin.x-5 &&
						this.pos.x<this.origin.x+5 &&
						this.pos.y>this.origin.y-5 &&
						this.pos.y<this.origin.y+5 &&
						this.stick==true
					){
						this.step = undefined;
						this.pos.x = this.origin.x;
						this.pos.y = this.origin.y;
						if(fly.caught==true){
							fly.eat();
						}
				}
				// catching fly
				if( fly.x>this.pos.x-20 &&
						fly.x<this.pos.x+20 &&
						fly.y>this.pos.y-20 &&
						fly.y<this.pos.y+20 &&
						this.stick==false
						){
								this.backToOrigin();
								this.stick=true;
								fly.caught=true;
				}
			}
		}
}

function Fly(X,Y,IMG){
    this.x = X;
    this.y = Y;
    this.img = IMG;
		this.caught = false;

    this.display = ()=>{
			image(this.img,this.x-this.img.width/2,this.y-this.img.height/2);
			if(this.caught==true){
					this.x = chameleon.tip.pos.x;
					this.y = chameleon.tip.pos.y;
			}
    }

		this.eat = ()=>{
			this.caught=false;
			this.x = random(0,width);
			this.y = random(0,height);
			score++;
		}
}
