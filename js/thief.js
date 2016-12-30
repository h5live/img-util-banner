var CanvasImage = function(image){
	this.imgEl = (image.jquery)? image[0]: image;
	this.canvas = document.createElement('canvas'),
	this.context = this.canvas.getContext('2d');
	document.body.appendChild(this.canvas);
	this.width = this.canvas.width = $(this.imgEl).width(),
	this.height = this.canvas.height = $(this.imgEl).height();
	this.context.drawImage(this.imgEl, 0, 0);
	$(this.canvas).hide();
}
CanvasImage.prototype.clear = function() {
	this.context.clearRect(0, 0, this.width, this.height);  
}
CanvasImage.prototype.update = function(imageData) {
	this.context.putImageData(imageData, 0, 0);
}
CanvasImage.prototype.getPixelCount = function() {
	return this.width * this.height;
}
CanvasImage.prototype.getImageData = function() {
	return this.context.getImageData(0, 0, this.width, this.height);
}
CanvasImage.prototype.removeCanvas = function() {
	$(this.canvas).remove();
}
function getAverageRGB(sourceImage) {
	var sampleSize = 10;
	var image = new CanvasImage(sourceImage),
		imageData = image.getImageData(),
		pixels = imageData.data,
		pixelCount = image.getPixelCount();  
	var i = 0,
		count = 0,
		rgb = {r:0,g:0,b:0};
    while ( (i += sampleSize * 4) < pixelCount ) {
		if(pixels[i+3] > 125){
	        ++count;
			rgb.r += pixels[i];
	        rgb.g += pixels[i+1];
	        rgb.b += pixels[i+2];
		}
    }
  	rgb.r = Math.floor(rgb.r/count);
    rgb.g = Math.floor(rgb.g/count);
    rgb.b = Math.floor(rgb.b/count);
	return rgb;
}




//十六进制颜色值域RGB格式颜色值之间的相互转换

//-------------------------------------
//十六进制颜色值的正则表达式
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function(){
	var that = this;
	if(/^(rgb|RGB)/.test(that)){
		var aColor = that.replace(/(?:||rgb|\(|\)| |RGB)*/g,"").split(",");
		var strHex = "#";
		for(var i=0; i<aColor.length; i++){
			var hex = Number(aColor[i]).toString(16);
			if(hex === "0"){
				hex += hex;
			}
			strHex += hex;
		}
		if(strHex.length !== 7){
			strHex = that;
		}
		return strHex;
	}else if(reg.test(that)){
		var aNum = that.replace(/#/,"").split("");
		if(aNum.length === 6){
			return that;
		}else if(aNum.length === 3){
			var numHex = "#";
			for(var i=0; i<aNum.length; i+=1){
				numHex += (aNum[i]+aNum[i]);
			}
			return numHex;
		}
	}else{
		return that;
	}
};

//-------------------------------------------------

/*16进制颜色转为RGB格式*/
String.prototype.colorRgb = function(){
	var sColor = this.toLowerCase();
	if(sColor && reg.test(sColor)){
		if(sColor.length === 4){
			var sColorNew = "#";
			for(var i=1; i<4; i+=1){
				sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
			}
			sColor = sColorNew;
		}
		//处理六位的颜色值
		var sColorChange = [];
		for(var i=1; i<7; i+=2){
			sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
		}
		return "RGB(" + sColorChange.join(",") + ")";
	}else{
		return sColor;
	}
};