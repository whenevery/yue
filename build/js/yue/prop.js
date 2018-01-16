(function(){
    function prop(obj , key , func){
        if(!obj.prototype[key]){
            Object.defineProperty(obj.prototype , key , {
                get:function(){
                    return func
                },
            });
        }
    }
    prop(Number , 'toMoney' , function(){
        return this.toFixed(2) - 0;
    });
    prop(Number , 'turnMoney' , function(){
        return (this/100).toFixed(2);
    });
    prop(String , 'turnMoney' , function(){
        return (this/100).toFixed(2);
    });
    prop(String , 'padStart' , function(num , split){
        split = split || ' ';
        return (Array(num + 1).join(split) + this).slice(-num);
    });
    prop(Number , 'padStart' , String.prototype.padStart);
    prop(String , 'startTime' , function( time){
        if(this.length > 10)return this + '';
        return this + (time || ' 00:00:00');
    });
    prop(String , 'endTime' , function( time){
        if(this.length > 10)return this + '';
        return this + (time || ' 23:59:59');
    });

    prop(Array , 'every' , function(func){
        for(var i=0;i<this.length;i++){
            if(func(this[i] , i) === false)return false;
        }
        return true;
    });
    prop(Array , 'find' , function(func){
        for(var i=0;i<this.length;i++){
            if(func(this[i] , i) === true)return this[i];
        }
        return null;
    });
    prop(Array , 'findIndex' , function(func){
        for(var i=0;i<this.length;i++){
            if(func(this[i] , i) === true)return i;
        }
        return -1;
    });
    prop(Array , 'sum' , function(func){
        var sum = 0;
        func = func || function(a){return a};
        this.forEach(function(a){
          sum += func(a)-0;
        });
        return sum;
    });
    if(!Array.isArray)Array.isArray = function(a){
        return a.constructor === Array && a instanceof Array;
    };

    if(!Object.assign)Object.assign = function(a , b){
        if(b)for(var i in b){
            if(b.hasOwnProperty(i))a[i] = b[i];
        }
    };
    Object.copyProp = function(prop){
        var rt = {};
        for(var key in prop){
            rt[key] = this[key];
        }
        return rt;
    };
})();