require('dotenv').config();
var request = require('request');
var fs = require('fs');
var params = process.argv.slice(2);
var GITHUB_USER = "ykworld";
var imageFolder = "avatars";

if (!fs.existsSync("./.env")) {
  console.log("The .env file is missing");
  return;
}

var GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (params[0] == undefined || params[1] == undefined) {
  console.log("Please enter two arguments!");
  return;
} else if (params.length > 2) {
  console.log("An incorrect number of arguments given to program");
  return;
} else if (GITHUB_TOKEN == undefined) {
  console.log('The .env file is missing information');
  return;
}

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
    if (response.statusCode === 404) {
      console.log("The provided owner/repo does not exist");
      return;
    } else if (response.statusCode === 401) {
      console.log("The .env file contains incorrect credentials");
      return;
    }
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
  if (err) {
    console.log("Errors:", err);
    return;
  }

  if (!fs.existsSync(imageFolder)) {
    console.log("The folder to store images to does not exist");
    return;
  }

  for (idx in result) {
    var url = result[idx].avatar_url;
    var filePath = imageFolder + "/" + result[idx].login + ".jpg";
    downloadImageByURL(url, filePath);
  }
});
