module.exports = function(){
    return {
        data:{
            canvasValue:"SKEW",
            width:'',
        },
        beforeCreated:function(next){
            next();
        },
        created:function(){
            this.width = window.innerWidth + 'px';
        },
        directives:{
            skew:{
                done:function(el , data){
                    console.log('skew start');
                    if( el.skewRuning)return false;
                    el.skewRuning = 1;
                    var skewData = data.newVal;
                    if(!el.skewDiv){
                        el.skewDiv = document.createElement('div');
                        el.appendChild(el.skewDiv);
                        el.skewDiv.style.position = 'absolute';
                        el.skewDiv.style.lineHeight = '1';
                        el.skewDiv.style.transformOrigin = 'left bottom';
                    }
                    var skewDiv = el.skewDiv;
                    skewDiv.style.color = skewData.color;
                    skewDiv.style.left = el.clientWidth + 'px';
                    skewDiv.style.fontSize = skewData.font + 'px';
                    skewDiv.innerHTML = skewData.val;
                    var clientHeight = skewDiv.clientHeight;
                    var clientWidth = skewDiv.clientWidth;
                    skewDiv.style.top = el.clientHeight/2 - clientHeight /2 + 'px';

                    var left =  el.clientWidth;
                    var skew = -50 , skewStep = 10;
                    skewDiv.style.transform = 'skewX('+skew+'deg)';
                    function run(){
                        if(left > (el.clientWidth - clientWidth ) / 2){
                            requestAnimationFrame(run);
                            skewDiv.style.left = left + 'px';
                            left -= 20;
                        }else{
                            skewDiv.style.left = (el.clientWidth - clientWidth ) / 2 + 'px';
                            requestAnimationFrame(animate);
                        }
                    }
                    var skewCount = 0;
                    run();
                    function animate(){
                        if(skew <= 0){
                            if(skewCount){
                                skewDiv.style.transform = 'skewX(0deg)';
                                el.skewRuning = 0;
                                return false;
                            }
                        }
                        if(!skewCount && skew < 50){
                            skew += skewStep;

                        }else{
                            if(!skewCount){
                                skewCount = 1;
                                skewStep = 5;
                                setTimeout(animate , 500);
                                return false;
                            }
                            skew -= skewStep;
                        }
                        skewDiv.style.transform = 'skewX('+skew+'deg)';
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