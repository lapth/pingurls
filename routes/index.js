var express = require('express');
var router = express.Router();
var schedule = require('node-schedule');
var axios = require('axios');

global.urls = JSON.parse(process.env.dfurls);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/add', function(req, res, next) {
  const _urls = req.body.urls;
  if (_urls) {
    for (let _url of _urls) {
      if (!global.urls.includes(_url)) global.urls.push(_url);
    }
  }
  console.log("URLs: %s", global.urls);
  res.send("Added!");
});

router.post('/remove', function(req, res, next) {
  const _urls = req.body.urls;
  if (_urls) {
    global.urls = global.urls.filter(url => !_urls.includes(url));
  }

  console.log("URLs: %s", global.urls);
  res.send("Removed!");
});

router.get('/ping', function(req, res, next) {
  res.send("Hello, I am alive!");
});

router.get('/list', function(req, res, next) {
  res.send(global.urls);
});

function startPingUrls() {
  console.log("Starting pingging URLs.");

  console.log("URLs: %s", global.urls);

  // Run each 25 minutes
  
  schedule.scheduleJob("*/5 * * * *", function () {
    global.urls.forEach(async(url) => {
      var data = await (await axios.get(url)).data;
      console.log("Pingged URL: %s\n%s", url, data);
    })
  });
}

startPingUrls();

module.exports = router;
