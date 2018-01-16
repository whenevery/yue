(function(){
    /*
    * path 路径
    * name 名称
    * component 模板
    * js  加载的js
    * loadNew 每次获取新的view
    * */
    var router = yue.router = {};
    var routers = [],prevRouter;
    var options = router.options = {
        mode:'history',
        viewUrl:'/yue/view',
        viewKey:'view',
        htmlUrl:'/yue/html',
        htmlKey:'html',
    };
    router.start = function(url){
        if(!url){
            if(options.mode === 'history'){
                url = location.pathname;
            }else{
                url = location.hash.slice(1) || '/';
            }
        }
        router.push(url);
    };
    function pathTest(path , url){
        return new RegExp(path.replace(/\*/g,'.*').replace(/\:\w+/g,'\\w+')).test(url);
    }
    function isRealPath(path){
        return path && !/\*|\:/g .test(path) && /^\// .test(path);
    }
    function getRealPath(path , router){
        if(isRealPath(path))return path;
        return router.path;
    }
    function getParams(path , router){
        var params = {};
        if(isRealPath(path)){
            var values = path.split('/');
            var keys = router.path.split('/');
            keys.forEach(function(a , i){
                if(a.indexOf(':') === 0){
                    params[a.slice(1)] = values[i];
                }
            })
        }
        return params;
    }
    function findRouter(url){
        var r;
        routers.every(function(a){
            if((a.name === url && isRealPath(a.path)) || a.path === url || pathTest(a.path , url)){
                r = a;
                return false;
            }
            return true;
        });
        return r;
    }
    router.push = function(options){
        if(typeof options === 'object'){
            routers.push(options);
        }else{
            console.log('router.push' , options);
            var r = findRouter(options);
            yue.clearHtml();
            if(r){
                var realRouter = {
                    originPath:r.path,
                    path:getRealPath(options , r),
                    params:getParams(options , r),
                    loadNew:r.loadNew,
                    component:r.component,
                    js:r.js,
                    name:r.name,
                    query:yue.common.getHrefData(getRealPath(options , r))
                };
                console.log(realRouter);
                var newQueue = new yue.queue();
                newQueue.add(function(next){
                    console.log('newQueue beforeEach');
                    if(router.beforeEach){
                        router.beforeEach(prevRouter , realRouter , next);
                    }else{
                        next();
                    }
                });
                newQueue.add(function(next){
                    yue.trigger('router-before');
                    next();
                });
                var jsData;
                newQueue.add(function(next){
                    router.load(realRouter.js , function(view){
                        jsData = yue.loadJs(view);
                        console.log(jsData);
                        next();
                    });
                });
                newQueue.add(function(next){
                    console.log('newQueue router');
                    if(router.options.mode === 'history'){
                        if(prevRouter)history.pushState({path:realRouter.path}, "", realRouter.path);
                    }else{
                        if(prevRouter)history.pushState({path:realRouter.path});
                        location.hash = realRouter.path;
                    }
                    router.load(realRouter.component , function(view){
                        yue.loadView(view , jsData , function(){

                        });
                    } , realRouter.loadNew);
                    prevRouter = realRouter;
                    next();
                });
                newQueue.add(function(next){
                    console.log('newQueue afterEach');
                    if(router.afterEach){
                        router.afterEach(prevRouter , realRouter );
                    }
                    next();
                });
                newQueue.start();
            }
        }
    };
    window.addEventListener("popstate", function() {
        var currentState = history.state;
        if(currentState){
            router.push(currentState.path);
        }
    });
    var loadView = {};
    router.load = function(url , call , sts){
        if(!sts && loadView[url]){
            call && call(loadView[url]);
            return false;
        }
        var requestUrl,isString = typeof url ==='string';
        var urlData = {};
        if(isString && /^http/.test(url)){
            urlData[options.htmlKey] = url;
            requestUrl = yue.common.addUrlParam(options.htmlUrl , urlData);
        }else if(isString && /^\//.test(url)){
            requestUrl = url;
        }else{
            if(isString && url.indexOf('=')===-1){
                urlData[options.viewKey] = url;
            }else{
                urlData = url;
            }
            requestUrl = yue.common.addUrlParam(options.viewUrl , urlData);
        }
        console.log('url',url );
        console.log('requestUrl',requestUrl );
        yue.get(requestUrl,function(view){
            call && call(loadView[url] = view);
        });
    }
 })();