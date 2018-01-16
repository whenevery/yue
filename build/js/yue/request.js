yue.request = function(options){
  yue.trigger('request-start-filter',options);
  options = Object.assign({
    method:'GET',
  },options);
  options.headers = Object.assign({'X-Requested-With':'XMLHttpRequest'},options.headers);
  options.method = options.method.toUpperCase();
  var xmlHttp=new XMLHttpRequest();
  var readyState = 0;
  function state_Change(){
    if(xmlHttp.readyState >= readyState){
      readyState = xmlHttp.readyState;
      if (xmlHttp.readyState===4){
        if(xmlHttp.status === 200){
          options.success && options.success(yue.common.parse(xmlHttp.responseText));
          yue.trigger('request-success' , xmlHttp.readyState , readyState)
        }else{
          options.error && options.error({
            state:xmlHttp.readyState,
            status:xmlHttp.status,
            readyState:readyState
          },yue.common.parse(xmlHttp.responseText));
          yue.trigger('request-status-error' , xmlHttp.status, yue.common.parse(xmlHttp.responseText));
        }
        yue.trigger('request-complete' , {
          state:xmlHttp.readyState,
          status:xmlHttp.status,
          readyState:readyState
        } , xmlHttp)
      }
    }else{
      options.error && options.error({
        state:xmlHttp.readyState,
        readyState:readyState
      });
      yue.trigger('request-state-error' , xmlHttp.readyState , readyState);
      yue.trigger('request-complete' , {
        state:xmlHttp.readyState,
        status:0,
        readyState:readyState
      } ,xmlHttp)
    }
  }
  xmlHttp.onreadystatechange=state_Change;
  var data;
  if(options.file){
    data = new FormData();
    if(options.data)for(var key in options.data){
      var val = options.data[key];
      data.append(key , val);
    }
  }
  else if(options.method === 'POST'){
    options.headers['Content-Type']='application/json; charset=utf-8';
    data = yue.common.stringify(options.data);
  }
  else{
    options.url = yue.common.addUrlParam(options.url , options.data);
  }
  xmlHttp.ontimeout = function(){
    options.error && options.error({
      state:504,
      status:504,
      readyState:0,
      message:'请求超时'
    });
    options.complete && options.complete({
      code:504,
      state:504,
      status:504,
      readyState:0,
      message:'请求超时'
    });
    yue.trigger('request-time-out');
  };
  xmlHttp.timeout = options.timeout || 60000;
  xmlHttp.open(options.method,options.url,true);
  if(options.headers){
    for(var key in options.headers){
      xmlHttp.setRequestHeader(key , options.headers[key]);
    }
  }
  xmlHttp.send(data);
  yue.trigger('request-send-filter' , options  , xmlHttp);
  return xmlHttp;
};
yue.get = function(url , data , call , options){
  if(typeof data === 'function'){
    options = call;
    call = data;
    data = {};
  }
  options = options || {needAbort:1};
  return yue.request(Object.assign({
    url:url,
    data:data,
    success:call
  },options));
};
yue.post = function(url , data , call , options){
  if(typeof data === 'function'){
    options = call;
    call = data;
    data = {};
  }
  options = options || {};
  return yue.request(Object.assign({
    url:url,
    method:'POST',
    data:data,
    success:call
  },options));
};
yue.postFile = function(url , data , call , error){
  if(typeof data === 'function' && !call){
    call = data;
    data = {};
  }
  var timeout = data.timeout || 60 * 1000;
  delete data.timeout;
  return yue.request({
    url:url,
    method:'POST',
    file:true,
    timeout:timeout,
    data:data,
    success:call,
    error:error
  });
};

