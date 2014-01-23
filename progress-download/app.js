var http = require('http');
var fs = require('fs');
var ProgressBar = require('progress');

function download(url, end) {
    var arrUrl = url.split('/');
    var filename = arrUrl[arrUrl.length - 1];
    http.get(url, function(res) {
        console.log('download file size:' + res.headers['content-length']);
        var len = parseInt(res.headers['content-length'], 10);
        var bar = new ProgressBar('downloading [:bar] :percent :etas', {
            complete: '=',
            incomplete: ' ',
            width: 30,
            total: len
        });
        var chunks = [];
        var size = 0;
        res.on('data', function(chunk) {
            size += chunk.length;
            chunks.push(chunk);
            bar.tick(chunk.length);
        });
        res.on('end', function() {
            var data = Buffer.concat(chunks, size);
            fs.writeFile(filename, data, function(err) {
                if (err) {
                    console.log('write file error:' + err);
                } else {
                    console.log('download file done ' + filename);
                    end(filename);
                }
            });
        });
        res.on('error', function(err) {
            console.log('download file error:' + err);
        });
    }).on('error', function(e) {
        console.log(e.message);
    }).setTimeout(30000, function(r) {
        console.log("timeout");
        this.abort();
    });
}

download('下载地址', function() {
    console.log('ok');
});