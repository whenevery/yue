window.yue = {};
yue.config = function(a , b){
    if(typeof a === 'object'){
        for(var key in a){
            yue.config(key , a[key]);
        }
    }else{
        if(!a || !b || typeof b !== 'object')return false;
        if(yue[a]){
            if(yue[a].config){
                yue[a].config(b);
            }else{
                if(yue[a].options){
                    Object.assign(yue[a].options,b);
                }else{
                    yue[a].options = b;
                }
            }
        }
    }
};
yue.clearHtml = function(){
    yue.app.innerHTML = '';
};
window.onload = function(){
    yue.app = document.getElementById('yue');
    yue.router.start();
};