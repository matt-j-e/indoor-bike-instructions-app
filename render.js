const canvas=document.getElementById('visualiser');
canvas.width=window.innerWidth-40;
canvas.height=window.innerHeight-100;

const ctx=canvas.getContext('2d');

function drawLine(ctx,startX,startY,endX,endY,color) {
  ctx.save();
  ctx.strokeStyle=color;
  ctx.beginPath();
  ctx.moveTo(startX,startY);
  ctx.lineTo(endX,endY);
  ctx.stroke();
  ctx.restore();
}

function drawBar(ctx,upperLeftCornerX,upperLeftCornerY,width,height,color) {
  ctx.save();
  ctx.fillStyle=color;
  ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
  ctx.restore();
}

function drawText(ctx,text,xPos,yPos,color,baseline,weight,size,family){
  ctx.save();
  ctx.fillStyle=color;
  ctx.textBaseLine=baseline;
  ctx.font=`${weight} ${size}px ${family}`;
  ctx.fillText(text,xPos,yPos);
  ctx.restore();
}

class Visualiser {
  constructor(options, workout){
    this.options=options;
    this.workout=workout;
    this.canvas=options.canvas;
    this.ctx=this.canvas.getContext('2d');
    this.maxValue=Math.max(...this.workout.steps.map(step => step.watts));
  }

  workoutLength(){
    return this.workout.steps.reduce((tot, step) => tot + step.duration, 0);
  }

  drawGridLines(){
    const canvasActualHeight=this.canvas.height-this.options.padding*2;

    let gridValue=0;
    while(gridValue<=this.maxValue){
      const gridY=canvasActualHeight*(1-gridValue/this.maxValue)+this.options.padding;
      drawLine(this.ctx,0,gridY,this.canvas.width,gridY,this.options.gridColor);
      drawText(this.ctx,gridValue,0,gridY-2,this.options.gridColor,'bottom','bold',10,'Arial');

      gridValue+=this.options.gridScale;
    }
  }

  drawYAxis(){
    drawLine(this.ctx,20,this.options.padding/2,20,this.canvas.height,this.options.gridColor);
  }

  drawBars(){
    const canvasActualHeight=this.canvas.height-this.options.padding*2;
    const canvasActualWidth=this.canvas.width;
    const secWidth=canvasActualWidth/this.workoutLength();
    
    let startX=this.options.padding;
    for(let step of this.workout.steps){
      const barHeight=Math.round((canvasActualHeight*step.watts)/this.maxValue);
      const barWidth=Math.floor(secWidth*step.duration);
      const startY=this.canvas.height-barHeight-this.options.padding;
      console.log('StartX',startX,'Bar Height:',barHeight,'Bar Width:',barWidth);
      drawBar(
        this.ctx,
        startX,
        startY,
        barWidth,
        barHeight,
        'skyblue'
      )
      drawText(this.ctx,step.watts,startX,startY,'red','bottom','bold',16,'Helvetica');
      startX+=barWidth;
    }
  }

  draw(){
    this.drawBars();
    this.drawGridLines();
    this.drawYAxis();
  }
}

const newVisualiser=new Visualiser(
  {
    canvas:canvas,
    padding:20,
    gridScale:20,
    gridColor:'gray'
  },
  workout
)

newVisualiser.draw();

