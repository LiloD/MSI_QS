
var parseFile = function(data){
    var lines = data.split('\n');
    console.log("file line", lines.length);
    var iInfo = {
        qs: []
    };
    var iInfos = [];

    lines.forEach(function(line, idx) {
        var needSave = parseLine(iInfo, line);
        if (needSave && Object.keys(iInfo).length > 1) {
            if (iInfo.qs.length == 0)
                console.log('qs length 0', idx)
            iInfos.push(iInfo);
            iInfo = {
                qs: []
            };
        }
        // console.log('parse line finish ' + idx);
    });
    if (Object.keys(iInfo).length > 1)
        iInfos.push(iInfo);
    // console.log('parse finish', iInfos.length);
    return iInfos;
}

var parseLine = function(iInfo, line){
    var line;
    var qInfo = iInfo.qs;

    line = line || "";  // ignore wrong parm
    line = line.trim();  // remove the leading and tailing invisible char
    if (!line) {  // if line is invalid, return
        return;
    }

    if (line.match(/^----/)) {
        // console.log('new interview coming');
        return true;
    }

    parseHeader(iInfo, line);
    parseQuestion(qInfo, line);
}

var parseHeader = function(iInfo, line) {
    ['Client', 'Candidate', 'Date', 'Type'].forEach(function(k){
        var re = new RegExp('^' + k + ': (.*)$', "i");
        var match = re.exec(line);
        // console.log('match header', match);
        if (!!match) {
            iInfo[k] = match[1];
        }
    }); 
}

var parseQuestion = function(qInfo, line) {
    var re = new RegExp('^[0-9]+[).]? (.*)' + '$', 'i');
    var match = re.exec(line);
    // console.log('match question', match);
    if (!!match) {
        qInfo.push(match[1])
    }
}

module.exports = parseFile;
