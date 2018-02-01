
var express = require('express'),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	app = express();
global.__ROOT__ = __dirname;
process.env.NODE_ENV = '1';
global.publicDir = process.env.NODE_ENV?'public':'build';
global.viewDir = process.env.NODE_ENV?'views':'build/views';
//静态文件目录
app.use(express.static(path.join(__dirname, publicDir)));

//记录请求时间过长的链接  总时间
app.use(function(req,res,next){
    var method = req.method;
    //非get post不进入后面逻辑
    if(method !== 'GET' && method !== 'POST'){
        return res.status(405).end();
    }
    //带。的链接 在静态文件目录找不到的情况下 直接返回404
    if(req.path.indexOf('.') !== -1){
        console.log('file url 404');
        return res.status(404).end();
    }
    var startTime = new Date();
    console.log(useCommon.parseDate(startTime) , req.method , req.url );
    var calResponseTime = function () {
        var deltaTime = new Date() - startTime;
        if(deltaTime > 5000){
            useLog.log(req.baseUrl + req.path + '  deltaTime ' + deltaTime);
        }
    };
    res.once('finish', calResponseTime);
    res.once('close', calResponseTime);
    return next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(function(req , res , next){
	req.__xhr = req.xhr || req.body.__isAjax || req.query.__isAjax;
	next();
});

app.set('views', path.join(__dirname, viewDir));
app.engine('.html',require('ejs').__express);
app.set('view engine', 'html');

process.on('uncaughtException', function (err) {
	console.error('process uncaughtException');
	console.error(err);
});
process.on('error', function (err) {
	console.error('process error');
	console.error(err);
});
var useModel = global.useModel = require('./models');
useModel.init(app , function(){
});

module.exports = app;
