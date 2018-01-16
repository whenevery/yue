yue.common = function(object , method , a , b , c , d , e){
    if(object === null || object === undefined)return object;
    if(object[method])object[method](a,b,c,d,e);
    if(yue.common[method]){
        yue.common[method](a,b,c,d,e);
    }
};
/*
 * 日期格式化
 * */
yue.common.parseDate = function(date , format){
  format = format || 'Y-m-d H:i:s';//默认转换格式
  if(!(date instanceof Date)){
    if(date - 0){
      date -= 0;
    }
    date = new Date(date);
  }
  if(date == 'Invalid Date')return '';
  var time = {};
  time.Y = date.getFullYear();
  time.y = (time.Y + '').slice(2);
  time.m = this.stringPadStart(date.getMonth() + 1 , 2 , '0');
  time.d = this.stringPadStart(date.getDate() , 2 , '0');
  time.D = '星期' + '日一二三四五六'[date.getDay()];
  time.H = this.stringPadStart(date.getHours() , 2 ,'0');
  time.h = this.stringPadStart(time.H%12 , 2 , '0');
  time.i = this.stringPadStart(date.getMinutes() , 2 , '0');
  time.s = this.stringPadStart(date.getSeconds(), 2 ,0);
  time.w = this.stringPadStart(date.getMilliseconds(),3 ,0);
  time.a = time.H >= 12 ?'下午':'上午';
  return format.replace(/./g,function(a){
    return time[a] || a;
  });
};
yue.common.parse = function(data){
  try{
    return JSON.parse(data);
  }catch (e){
    try{
      return eval('('+data+')');
    }catch (e){
      return data;
    }
  }
};
yue.common.stringify = function(data){
  if(typeof data !== 'object')return data+'';
  try{
    return JSON.stringify(data) + '';
  }catch (e){
    return data + '';
  }
};

yue.common.serialize = function(data){
  var str = '';
  for(var key in data){
    var o = data[key];
    if(o != null){
      if(str)str+='&';
      str += key + '=' + encodeURIComponent(o);
    }
  }
  return str;
};
yue.common.concatImgUrl = function(url){
  if(!url)return url;
  if(/^http/.test(url))return url;
  return (yue.session.apiImgUrl || localStorage.apiImgUrl) + url;
};
yue.common.addUrlParam = function(url , param){
  if(!param)return url;
  if(param && typeof param == 'object'){
    param = yue.common.serialize(param);
  }
  if(!param)return url;
  url += /\?/.test(url)?'&':'?';
  return url += param;
};
yue.common.getHrefData = function(url){
  if(!url)return {};
  if(url.indexOf('?')>=0)url = url.split('?')[1];
  var rt = {};
  url.split('&').forEach(function(a){
    var index = a.indexOf('=');
    if(index>-1)rt[a.substr(0,index)] = decodeURIComponent(a.substr(index+1));
  });
  return rt;
};
yue.common.numberToCn = function(number){
  return (number+'').split('').reverse().map(function(a , i){
    return a!=0 && ('一二三四五六七八九'[a-1] + (i?'十':'')) || ''
  }).reverse().join('');
};
yue.common.sumTime = function(time , format){
  format = format || 'dhis';
  var timeData = {
    d:'',
    s:'',
    h:'',
    i:''
  };
  time = Math.floor(time / 1000);
  var more;
  if(more = time % 60 ){
    timeData.s = more + '秒';
    time -= more;
  }
  time /= 60;
  if(more = time % 60 ){
    timeData.i = more + '分';
    time -= more;
  }
  time /= 60;
  if(more = time % 24 ){
    timeData.h = more + '小时';
    time -= more;
  }
  time /= 24;
  if(time > 1){
    timeData.d = time + '天';
  }
  return format.replace(/./g , function(a){
    return timeData[a];
  });
};
yue.common.getLength = function(str){
  var len = str.length * 2;
  var match = str.match(new RegExp('[\\w\\s`~!@#$%^&*()-=+|\\[\\]{}"\',./<>?\\\\]','g'));
  if(match)len -= match.length;
  return len;
};
yue.common.convertBase64UrlToBlob = function (urlData , type){
  var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
  //处理异常,将ascii码小于0的转换为大于0
  var ab = new ArrayBuffer(bytes.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob( [ab] , {type : type});
};
yue.common.copyProp = function(o , prop){
  var rt = {};
  for(var key in prop){
    rt[key] = o[key];
  }
  return rt;
};
