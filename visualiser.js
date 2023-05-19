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
    let gridValue=0;
    while(gridValue<=this.maxValue){
      const gridY=this.actualHeight*(1-gridValue/this.maxValue)+this.options.padding;
      this.drawLine(0,gridY,this.canvas.width,gridY,this.options.gridColor);
      this.drawText(gridValue,0,gridY-2,this.options.gridColor,16,'bottom','bold','Helvetica');

      gridValue+=this.options.yScaleRange;
    }
  }

  drawXMarkers(){
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

  readableTime(totalSecs){
    let mins=Math.floor(totalSecs/60);
    let secs=totalSecs%60;
    let hours=Math.floor(totalSecs/3600);
    mins=mins<10 ? '0'+mins : mins;
    secs=secs<10 ? '0'+secs : secs;
    return `${hours}:${mins}:${secs}`;
  }

  drawElapsed(secs){
    this.drawText(this.readableTime(secs),canvas.width-90,50,this.options.axisColor,20,'bottom','bold');
  }

  currentStep(secs){
    let accumulatedStepDuration=0;
    let stepIndex=0;
    const numberOfSteps=this.workout.steps.length;
    while(secs<this.workoutLength()){
      const currentStep=this.workout.steps[stepIndex];
      const currentStepEnd=accumulatedStepDuration+currentStep.duration;
      if(currentStepEnd>secs) {
        return {
          totalDuration:currentStep.duration,
          remainingDuration:currentStepEnd-secs,
          intensity:currentStep.watts
        }
      }
      accumulatedStepDuration+=currentStep.duration;
      stepIndex++;
    }
    return {
      totalDuration:0,
      remainingDuration:0,
      intensity:0
    };
  }

  drawCurrentStepRemaining(value){
    this.drawText(this.readableTime(value),canvas.width-90,80,this.options.axisColor,20,'bottom','bold');
  }

  drawCurrentStepIntensity(value){
    this.drawText(value,canvas.width-90,110,this.options.axisColor,20,'bottom','bold');
  }

  draw(x, secs=0){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.drawXAxis();
    this.drawGridLines();
    this.drawXScale();
    this.drawBars();
    this.drawXMarkers();
    this.drawYAxis(x);
    this.drawElapsed(secs);
    const stepData=this.currentStep(secs);
    this.drawCurrentStepRemaining(stepData.remainingDuration);
    this.drawCurrentStepIntensity(stepData.intensity);
  }

  start(){
    const startTime=Date.now();
    this.stop();
    let x=0;
    let secs=0;
    this.timerId=setInterval(() => {
      secs++;
      x=(secs/this.workoutLength())*this.actualWidth;
      this.draw(x, secs);
      if(secs%60===0) {
        secs = Math.round((Date.now() - startTime) / 1000);
      }
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
visualiser.draw(0);
