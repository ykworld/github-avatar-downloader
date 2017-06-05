var request = require('request');
var fs = require('fs');
var params = process.argv.slice(2);
var GITHUB_USER = "ykworld";
var GITHUB_TOKEN = "8864bf92944159b9939ee3995f5850e8a9c76682";

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var requestOptions = {
    url: requestURL,
    headers: {
      'User-Agent': 'request'
    }
  }

  request(requestOptions, function (error, response, body) {
    cb(error, JSON.parse(body));
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
        .on('error', function (err) {
          throw err;
        })
       .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(params[0], params[1], function(err, result) {
  console.log("Errors:", err);

  for (idx in result) {
    var url = result[idx].avatar_url;
    var filePath = "avatars/" + result[idx].login + ".jpg";
    downloadImageByURL(url, filePath);
  }
});
