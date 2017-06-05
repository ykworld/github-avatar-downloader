var request = require('request');
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

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);

  for (idx in result) {
    console.log(result[idx].avatar_url);
  }
});