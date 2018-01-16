(function(){
    var yueModel;
    yue.bind('router-before' , function(){
        if(yueModel){
            yueModel.jsModel.destroy && yueModel.jsModel.destroy();
        }
    });
    yue.loadView = function(view ,jsModel, call){
        yueModel = {
            view:view,
            jsModel:jsModel,
        };

        yue.app.innerHTML = view;
        if(call)call();
    };
    yue.loadJs = function(view , call){
        var module = {};
        eval(view);
        if(call)call(module.exports);
        return module.exports && module.exports();
    };
})();