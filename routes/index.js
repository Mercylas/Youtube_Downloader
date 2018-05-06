var express = require('express');
var router = express.Router();
var ytdl = require('youtube-dl');
var request = require('request');
var https = require('https');
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Youtube Downloader' });
});

// utility function to convert bytes to human readable.
function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

router.post('/downloads', function(req, res, next) {
    var url = req.body.url,
        formats = [],
        pattern = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

    request.get(url, function (err, resp, body) {
        // check if it is valid url
        if(pattern.test(resp.request.uri.href)) {
            ytdl.getInfo(url, [], function(err, info) {
                if(err) return res.render('listvideo', {error: 'The link you provided either not a valid url or it is not acceptable'});
                info.formats.forEach(function(item) {
                    item.filesize = item.filesize ? bytesToSize(item.filesize): 'unknown';
                    formats.push(item);
                });
                res.render('listvideo', {meta: {id: info.id, formats: formats}});
            })
        }
        else {
            res.render('listvideo', {error: 'The link you provided either not a valid url or it is not acceptable'});
        }
    });
})

router.post('/m4aOLD', function(req, res, next) {
    var url = req.body.url,
        formats = [],
        pattern = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

    request.get(url, function (err, resp, body) {
        // check if it is valid url
        if(pattern.test(resp.request.uri.href)) {
            ytdl.getInfo(url, ['-f', 'm4a'], function(err, info) {
                if(err) return res.render('listvideo', {error: 'The link you provided either not a valid url or it is not acceptable'});
                info.formats.forEach(function(item) {
                	if(item.ext == 'm4a'){
                	item.filesize = item.filesize ? bytesToSize(item.filesize): 'unknown';
                    //res.download(item.url, "#{info.title}.m4a");
                    // set Content-Disposition header
  					// transfer the file
  					//https.get(item.url).pipe(res);
                    formats.push(item);
                	}
                });
                res.render('listvideo', {meta: {id: info.id, formats: formats}});
            })
        }
        else {
            res.render('listvideo', {error: 'The link you provided either not a valid url or it is not acceptable'});
        }
    });
})

router.post('/m4a', function(req, res, next) {
    var url = req.body.url,
        formats = [],
        pattern = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

    request.get(url, function (err, resp, body) {
        // check if it is valid url
        if(pattern.test(resp.request.uri.href)) {
            ytdl.getInfo(url, ['-f', 'm4a'], function(err, info) {
                if(err) return res.render('listvideo', {error: 'The link you provided either not a valid url or it is not acceptable'});
                info.formats.forEach(function(item) {
                    if(item.ext == 'm4a'){
                    item.filesize = item.filesize ? bytesToSize(item.filesize): 'unknown';
                    var video = ytdl(url, ['-f', 'm4a'], {cwd: __dirname});
                    // Will be called when the download starts.
                    video.on('info', function(info) {
                    console.log('Download started');
                    console.log('filename: ' + info._filename);
                    console.log('size: ' + info.size);
                    });
                    //Hardcode Download Location
                    video.pipe(fs.createWriteStream('/Downloads/Music/' + info._filename));

                    formats.push(item);
                    }
                });
                res.render('listvideo', {meta: {id: info.id, formats: formats}});
            })
        }
        else {
            res.render('listvideo', {error: 'The link you provided either not a valid url or it is not acceptable'});
        }
    });
})
module.exports = router;
