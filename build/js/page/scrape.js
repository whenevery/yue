module.exports = function(){
  return {
    data:{
      scrape:{
        w:200,
        h:40,
        value:'谢谢惠顾',
        notice:'刮一刮',
        fontSize:20,
        clipWidth:10
      }
    },
    beforeCreated:function(next){
      next();
    },
    created:function(){

    },
    mounted:function(){

    },
    updated:function(){

    },
    destroy:function(){

    },
    directives:{
      scrape:{
        done:function(el , data){
          var newVal = data.newVal;
          var canvas = document.createElement('canvas')
          canvas.width = newVal.w;
          canvas.height = newVal.h;
          el.appendChild(canvas)
          var backCanvas = document.createElement('canvas')
          backCanvas.width = newVal.w;
          backCanvas.height = newVal.h;
          var backCtx = backCanvas.getContext('2d')
          backCtx.fillStyle = 'red';
          backCtx.fillRect(0, 0, newVal.w, newVal.h);
          backCtx.beginPath()
          backCtx.fillStyle = '#000';
          backCtx.font = newVal.fontSize + 'px Arial';
          backCtx.textAlign="center";
          backCtx.fillText(newVal.value , newVal.w / 2 , (newVal.h + newVal.fontSize) / 2)
          var backUrl = backCanvas.toDataURL();
          canvas.style.background = 'url('+ backUrl +')'
          var backImg = new Image
          backImg.src = backUrl;
          var ctx = canvas.getContext('2d')
          ctx.fillStyle = '#eee';
          ctx.fillRect(0, 0, newVal.w, newVal.h);
          ctx.beginPath()
          ctx.fillStyle = '#000';
          ctx.font = newVal.fontSize + 'px Arial';
          ctx.textAlign="center";
          ctx.fillText(newVal.notice , newVal.w / 2 , (newVal.h + newVal.fontSize) / 2)
          var isDown,offsetX,offsetY;
          ctx.beginPath();
          el.addEventListener('mousedown' , function(e){
            isDown = true;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
            clearData(offsetX, offsetY)
          })
          var imageData = ctx.getImageData(0, 0, newVal.w, newVal.h)
          function clearData(x, y){
            for(var i=0;i<newVal.w;i++){
                for(var j=0;j<newVal.h;j++){
                    if(getLength(x,y,i,j) <= newVal.clipWidth){
                        var index = (j * newVal.w + i) * 4;
                      imageData.data[index] =
                        imageData.data[index + 1] =
                          imageData.data[index + 2] =
                            imageData.data[index + 3] = 0
                    }
                }
            }
            ctx.putImageData(imageData , 0, 0)
          }
          function getLength(x,y,i,j){
              return Math.sqrt((x - i) * (x - i) + (y - j) * (y - j))
          }
          el.addEventListener('mousemove' , function(e){
            if(isDown){
              offsetX = e.offsetX;
              offsetY = e.offsetY;
              clearData(offsetX, offsetY)
            }
          })
          el.addEventListener('mouseup' , function(){
            isDown = false;
          })
        }
      }
    },
    methods:{
    },
    watch:{

    }
  };
};