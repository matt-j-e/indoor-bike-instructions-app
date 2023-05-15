class Visualiser{
  constructor(options, workout){
    this.options=options;
    this.workout=workout;
    this.canvas=options.canvas;
    this.ctx=this.canvas.getContext('2d');
    this.actualWidth=this.canvas.width-(this.options.padding*2);
    this.actualHeight=this.canvas.height-(this.options.padding*2);
    this.maxValue=Math.max(...this.workout.steps.map(step => step.watts));
    this.timerId=null;
  }

  drawLine(
    startX,
    startY,
    endX,
    endY,
    color
  ){
    this.ctx.save();
    this.ctx.strokeStyle=color;
    this.ctx.beginPath();
    this.ctx.moveTo(startX,startY);
    this.ctx.lineTo(endX,endY);
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawBar(
    upperLeftCornerX,
    upperLeftCornerY,
    width,
    height,
    color
  ){
    this.ctx.save();
    this.ctx.fillStyle=color;
    this.ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
    this.ctx.restore();
  }

  workoutLength(){
    return this.workout.steps.reduce((tot, step) => tot + step.duration, 0);
  }

  drawText(
    text,
    xPos,
    yPos,
    color,
    size,
    baseline='bottom',
    weight='normal',
    family='Arial'
  ){
    this.ctx.save();
    this.ctx.fillStyle=color;
    this.ctx.textBaseline=baseline;
    this.ctx.font=`${weight} ${size}px ${family}`;
    this.ctx.fillText(text,xPos,yPos);
    this.ctx.restore();
  }

  drawYAxis(x){
    const pad = this.options.padding;
    this.drawLine(x+pad,pad,x+pad,this.actualHeight+pad,this.options.axisColor);
  }

  drawXAxis(){
    const pad = this.options.padding;
    this.drawLine(pad,this.actualHeight+pad,this.actualWidth+pad,this.actualHeight+pad,this.options.axisColor);
  }

  drawGridLines(){
    // const canvasActualHeight=this.canvas.height-this.options.padding*2;

    let gridValue=0;
    while(gridValue<=this.maxValue){
      const gridY=this.actualHeight*(1-gridValue/this.maxValue)+this.options.padding;
      this.drawLine(0,gridY,this.canvas.width,gridY,this.options.gridColor);
      this.drawText(gridValue,0,gridY-2,this.options.gridColor,16,'bottom','bold','Helvetica');

      gridValue+=this.options.yScaleRange;
    }
  }

  drawXMarkers(){
    // const maxX=this.options.duration;
    const maxX=this.workoutLength();
    const markerStartY=this.actualHeight+this.options.padding-10;
    const markerEndY=markerStartY+10;
    let xValue=0;
    while(xValue<=maxX){
      const xPos=(xValue/maxX)*this.actualWidth+this.options.padding;
      this.drawLine(xPos,markerStartY,xPos,markerEndY,'green'); 
      xValue+=this.options.xScaleRange;
    }
  }

  drawXScale(){
    // const maxX=this.options.duration;
    const maxX=this.workoutLength();
    const scaleYPos=this.actualHeight+this.options.padding+20;
    let xValue=0;
    while(xValue<=maxX){
      const scaleXPos=(xValue/maxX)*this.actualWidth+this.options.padding-5;
      this.drawText(xValue/60,scaleXPos,scaleYPos,'green',16);
      xValue+=this.options.xScaleRange;
    }
  }

  drawBars(){
    const secWidth=(this.actualWidth)/this.workoutLength();
    
    let startX=this.options.padding;
    for(let step of this.workout.steps){
      const barHeight=Math.round((this.actualHeight*step.watts)/this.maxValue);
      // const barWidth=Math.floor(secWidth*step.duration);
      const barWidth=(step.duration/this.workoutLength())*this.actualWidth;
      const startY=this.canvas.height-barHeight-this.options.padding;
      this.drawBar(
        startX,
        startY,
        barWidth,
        barHeight,
        'skyblue'
      )
      this.drawText(step.watts,startX,startY,'red',16,'bottom','bold','Helvetica');
      startX+=barWidth;
    }
  }

  draw(x){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.drawXAxis();
    this.drawGridLines();
    this.drawXScale();
    this.drawBars();
    this.drawXMarkers();
    this.drawYAxis(x);
  }

  start(){
    this.stop();
    let x=0;
    let secs=0;
    const speed=this.actualWidth/this.workoutLength();
    this.timerId=setInterval(() => {
      this.draw(x);
      x+=(speed);
      secs++;
      console.log(secs);
    }, 1000);
  }
  
  stop(){
    if(this.timerId!=null){
      clearInterval(this.timerId);
      this.timerId=null;
    }
  }
}

const canvas=document.getElementById('visualiser');
canvas.width=1220;
canvas.height=800;
const visualiser=new Visualiser({
  canvas,
  xScaleRange:300,
  yScaleRange:20,
  axisColor:'gray',
  padding:30
},workout);
visualiser.start();
// visualiser.draw(0);