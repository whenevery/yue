module.exports = function(){
    return {
        data:{
            canvasValue:"YUE",
            width:'',
        },
        beforeCreated:function(next){
            next();
        },
        created:function(){
            this.width = window.innerWidth + 'px';
        },
        directives:{
            canvas:{
                done:function(el , data){
                    if( el.canvasRuning)return false;
                    el.canvasRuning = 1;
                    var canvasData = data.newVal;
                    if(!el.directiveCanvas){
                        el.directiveCanvas = document.createElement('canvas');
                        el.appendChild(el.directiveCanvas);
                        el.directiveCanvas.style.height = '100%';
                        el.directiveCanvas.style.width = '100%';
                    }
                    var canvas = el.directiveCanvas;
                    canvas.width = el.clientWidth;
                    canvas.height = el.clientHeight;
                    var ctx = canvas.getContext('2d');
                    ctx.fillStyle = canvasData.color;
                    ctx.font = canvasData.font + 'px Arial';
                    var realFont = 150;
                    var fontWidth = Math.round(ctx.measureText(canvasData.val).width);
                    var leftMargin = realFont + 20;
                    ctx.fillText(canvasData.val , el.clientWidth / 2 -fontWidth/2 , el.clientHeight/2 + realFont/2);
                    var dataTop = Math.round(el.clientHeight/2 - realFont / 2);
                    var dataLeft = Math.round(el.clientWidth / 2 - fontWidth / 2 - leftMargin);
                    var dataWidth = fontWidth + leftMargin * 2;
                    var dataHeight = realFont + 2;
                    var left = 150,leftStep = 10;
                    var autoImgData = ctx.getImageData(dataLeft,dataTop,dataWidth, dataHeight);
                    var hasConsole = 0;
                    autoImgData.data.forEach(function(a , i){
                        if(a){
                            if(!hasConsole){
                                hasConsole = 1;
                            }
                        }
                    });
                    var centerCount = 0,leftType='-';
                    var startLeft = el.clientWidth;
                    var startImageData;
                    function run(){
                        if(!startImageData){
                            startImageData = ctx.createImageData(dataWidth ,dataHeight);
                            for(var i=dataWidth;i>=leftMargin;i--){
                                for(var j=0;j<=dataHeight;j++){
                                    var index = dataWidth * j + i;
                                    var dataIndex = index * 4;
                                    var newIndex = index - left ;
                                    if(left >  j ) newIndex += j;
                                    else newIndex = index;
                                    newIndex *= 4;
                                    if(autoImgData.data[newIndex]){
                                        startImageData.data[dataIndex] = autoImgData.data[newIndex];
                                        startImageData.data[dataIndex+1] = autoImgData.data[newIndex+1];
                                        startImageData.data[dataIndex+2] = autoImgData.data[newIndex+2];
                                        startImageData.data[dataIndex+3] = autoImgData.data[newIndex+3];
                                    }
                                }
                            }
                        }
                        ctx.clearRect(0,0,el.clientWidth,el.clientHeight);
                        ctx.beginPath();
                        if(startLeft <= dataLeft){
                            ctx.putImageData(startImageData , dataLeft , dataTop);
                            animate();
                        }
                        else{
                            startLeft-=10;
                            ctx.putImageData(startImageData , startLeft , dataTop);
                            requestAnimationFrame(run);
                        }
                    }
                    run();
                    function animate(){
                        var newImageData = ctx.createImageData(dataWidth ,dataHeight);
                        if(left >= 0){
                            if(centerCount){
                                ctx.putImageData(autoImgData , dataLeft , dataTop);
                                el.canvasRuning = 0;
                                return false;
                            }
                        }
                        if(!centerCount && left <= 0){
                            left -= leftStep ;
                            leftStep ++;
                            centerCount = 1;
                            ctx.putImageData(autoImgData , dataLeft , dataTop);
                            requestAnimationFrame(animate);
                            return false;
                        }
                        if(left > 0){
                            for(var i=dataWidth;i>=leftMargin;i--){
                                for(var j=0;j<=dataHeight;j++){
                                    var index = dataWidth * j + i;
                                    var dataIndex = index * 4;
                                    var newIndex = index - left ;
                                    if(left >  j ) newIndex += j;
                                    else newIndex = index;
                                    newIndex *= 4;
                                    if(autoImgData.data[newIndex]){
                                        newImageData.data[dataIndex] = autoImgData.data[newIndex];
                                        newImageData.data[dataIndex+1] = autoImgData.data[newIndex+1];
                                        newImageData.data[dataIndex+2] = autoImgData.data[newIndex+2];
                                        newImageData.data[dataIndex+3] = autoImgData.data[newIndex+3];
                                    }
                                }
                            }
                            left -= leftStep;
                            leftStep++;
                        }else{
                            for(var i=0;i<=dataWidth-leftMargin;i++){
                                for(var j=0;j<=dataHeight;j++){
                                    var index = dataWidth * j + i;
                                    var dataIndex = index * 4;
                                    var newIndex = index - left ;
                                    if(-left >  j ) newIndex -= j;
                                    else newIndex = index;
                                    newIndex *= 4;
                                    if(autoImgData.data[newIndex]){
                                        newImageData.data[dataIndex] = autoImgData.data[newIndex];
                                        newImageData.data[dataIndex+1] = autoImgData.data[newIndex+1];
                                        newImageData.data[dataIndex+2] = autoImgData.data[newIndex+2];
                                        newImageData.data[dataIndex+3] = autoImgData.data[newIndex+3];
                                    }
                                }
                            }
                            if(leftType === '+'){
                                leftStep = 17;
                                left += leftStep;
                                leftStep--;
                            }
                            else {
                                if(left<=-leftMargin){
                                    leftType = '+';
                                    ctx.putImageData(newImageData , dataLeft , dataTop);
                                    setTimeout(animate , 500);
                                    return false;
                                }
                                left -= leftStep;
                                leftStep++;
                            }
                        }
                        ctx.putImageData(newImageData , dataLeft , dataTop);
                        requestAnimationFrame(animate);
                    }

                }
            }
        },
        methods:{
            canvasInput:function(el,ev){
                this.start(el.value);
            },
            start:function(val){
                clearTimeout(this.canvasTimer);
                var that = this;
                this.canvasTimer = setTimeout(function(){
                    that.canvasValue = val;
                },500);
            }
        },
        watch:{

        }
    };
};