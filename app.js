var express = require('express');
var cors = require('cors');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(cors());

app.get('/', function (req, res) {
  var ua = req.header('user-agent');
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile|ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(ua)) {
    console.log("mobile");
    res.sendFile(__dirname + '/index.mobile.html');
  }
  else {
    console.log("web");
    res.sendFile(__dirname + '/index.html');
  }
});

app.use(express.static(__dirname + '/'));

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'));
});