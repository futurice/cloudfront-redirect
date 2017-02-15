// server.js
var express = require('express');
var app = express();
var cf = require('aws-cloudfront-sign');


function getEnvVar(varname, defaultVal) {
    var result = process.env[varname];
    if(result!=undefined)
        return result;
    else
        return defaultVal;
}

if (!process.env.CLOUDFRONT_PRIVKEY ||
    !process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN ||
    !process.env.AWS_ACCESS_KEY_ID) {
    console.error("Required environment variables not set, exiting!");
    process.exit(1);
}
var listen_port = parseInt(getEnvVar("LISTEN_PORT", "8000"), 10);
var expire_timeout = parseInt(getEnvVar("URL_EXPIRE_TIME", "600"), 10);
var cloudfront_distribution = process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN;
var cloudfront_options = {
    keypairId: process.env.AWS_ACCESS_KEY_ID,
    privateKeyString: process.env.CLOUDFRONT_PRIVKEY
};

app.get('/*', function(req, res) {
    var key = req.originalUrl;
    console.log("Request: " + key);
    var url = cf.getSignedUrl('https://' + cloudfront_distribution + key, cloudfront_options);
    console.log("redirecting to: " + url);
    res.redirect(302, url);
});

app.listen(listen_port, function () {
  console.log('Example app listening on port ' + listen_port);
});
