
zip.workerScriptsPath = "./";
/**
 * @desc 鍘嬬缉鏂囦欢;
 * @event onprogress, onend, onerror;
 * */
var ZipArchive = function() {
  function noop() {};
  this.name = "name";
  this.zippedBlob = {};
  var _this = this;
  this.length = 0;
  this.onend = noop;
  this.onerror = noop;
  this.onprogress = noop;
  //鍒涘缓涓€涓欢杩熷璞�;
  var def = this.defer = new $.Deferred();
  zip.createWriter( new zip.BlobWriter("application/zip"), function(zipWriter) {
    _this.zipWriter = zipWriter;
    //缁х画鎵ц闃熷垪;
    def.resolve();
  }, this.error.bind(_this) );
};

ZipArchive.blob = function (filename, content) {
  if (typeof content !== 'string') return content
  return new Blob([ content ], {
    type: zip.getMimeType(filename)
  });
};

$.extend( ZipArchive.prototype, {
  /**
   * @desc 娣诲姞鏂囦欢锛� 瀹為檯涓婃槸涓茶鎵ц鍘嬬缉锛� 鍥犱负浣跨敤浜唈Q鐨勫欢杩熷璞★紝
   * @param String filename涓烘枃浠剁殑鍚嶅瓧;
   * @param String content;
   * @param Object options 浼犲弬
   *      渚嬪锛歿 level  : 0} 鍘嬬缉鐨勭瓑绾э紝0 鍒� 9, 0 涓轰笉鍘嬬缉锛� 9涓烘渶澶у帇缂╋紱
   *      渚嬪锛歿 comment : "鎻愮ず鏂囧瓧" }
   *      渚嬪锛歿 lastModDate : "鏈€鍚庣紪杈戞椂闂�" }
   * */
  "addFile" : function ( filename , content, options) {
    var _this = this;
    var blob = ZipArchive.blob(filename, content);
    this.defer = this.defer.then(function() {
      var def = $.Deferred();
      _this.zipWriter.add(filename, new zip.BlobReader(blob)
        ,function() { // reader
          console.log("addFile success!!");
          def.resolve();
          //zipWriter.close(callback);
        }, function (size, total) { //onend
          _this.onend(filename, blob, total);
          _this.length += total;
        }, function () { //onprogress
          _this.onprogress(filename, blob, total);
        },options || {
        //options
      });
      return def;
    });
  },

  "_addFolder" : function (foldername , options) {
    return this;
  },

  "size" : function () {
    return this.length;
  },

  /**
   * @desc 鑾峰彇blob鏂囦欢
   * */
  "get" : function () {
    return this.zippedBlob;
  },

  /**
   * @desc 瀵煎嚭涓簔ip鏂囦欢
   * */
  "export" : function ( name ) {
    name = name || this.name;
    var _this = this;
    this.defer.then(function() {
      _this.zipWriter.close(function( zippedBlob ) {
        if( typeof name === "string" || typeof name === "number") {
          var downloadButton = document.createElement("a"),
            URL = window.webkitURL || window.mozURL || window.URL;
          downloadButton.href = URL.createObjectURL( zippedBlob );
          downloadButton.download = name + ".zip";
          downloadButton.click();
        }else{
          name( zippedBlob );
        };
      });
    });
  },

  "error" : function() {
    this.onerror( this );
    throw new Error("error");
  }
});