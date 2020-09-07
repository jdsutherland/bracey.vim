const cssparser = require('postcss');

function CssFile(source, path, callback){
	callback = callback || function(){}
	this.path = path;
	this.setContent(source, callback);
}

CssFile.prototype.webSrc = function(){
	return this.source;
};

CssFile.prototype.selectorFromPosition = function(line){
	for (const rule of this.parsed.nodes) {
		const {
			start: { line: startLine },
			end: { line: endLine },
		} = rule.source
		if((startLine < line && endLine > line)
			|| (startLine == line && endLine != line)
			|| (startLine != line && endLine == line)
			|| (startLine == line && endLine == line)){
			return rule.selector || null;
		}
	}
	return null;
};

CssFile.prototype.setContent = function(source, callback){
	var changed = (this.source != undefined && this.source != source);

	this.source = source;

	try{
		this.parsed = cssparser.parse(source);
	}catch(err){
		callback(err);
		return;
	}

	if(changed){
		callback(null);
	}else{
		callback(null, null);
	}
};

module.exports = CssFile;
