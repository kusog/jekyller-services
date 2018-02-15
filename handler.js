'use strict';
const octokit = require('@octokit/rest')()

const username = "[username]";
const password = "[password]";
const reponame = "[reponame]";

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}
module.exports.updateContent = (event, context, callback) => {
  var content = event.content,
      name = event.name;

  if(!content && event.body) {
    var msg = JSON.parse(event.body);
    content = msg.content;
    name = msg.name;
  }

  console.log("event:" + JSON.stringify(event));

  octokit.authenticate({
      type: 'basic',
      username: username,
      password: password
    });

    octokit.repos.getContent({
      owner: username,
      repo: reponame,
      path: 'index.html'
    }).then(function(a) {
      octokit.repos.createFile({
        owner: username,
        repo: reponame,
        path: 'index.html',
        message: 'updating file',
        sha: a && a.data?a.data.sha:null,
        content: Buffer.from("---\r\nlayout: default\r\n---\r\n" + content + "").toString('base64')
      }).then(function(x) {

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type":"application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          message: 'Changes upgraded successfully!',
          input: event,
        }),
      };

      callback(null, response);
    });
  });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.createPost = (event, context, callback) => {
  var content = event.content,
      name = event.name,
      title = event.title;

      
  if(!content && event.body) {
    var message = JSON.parse(event.body);
    content = message.content;
    name = message.name;
    title = message.title;
  }

  var n = new Date();
  var fileName = name;
  if(!name) {
    fileName = "_posts/" + n.getFullYear() + "-" + (n.getMonth() +1).pad(2) + "-" + n.getDate().pad(2) + "-" + title + ".html";
  }
  else {
    fileName = "_posts/" + name + ".html";
  }
  fileName = fileName.toLowerCase();
  fileName = fileName.replace(/\s+/g, "-");
  //var fileName = "_posts/2018-02-14-testing3.html";

  function update(sha, name, content) {
    octokit.repos.createFile({
      owner: username,
      repo: reponame,
      path: name,
      message: 'updating file',
      sha: sha,
      content: Buffer.from("---\r\nlayout: post\r\ntitle: \"" + title + "\"\r\ndate: " + n.toISOString() + "\r\n---\r\n" + content + "").toString('base64')
    }).then(function(x) {

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type":"application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          message: 'Changes upgraded successfully!',
          input: event,
        }),
      };

      callback(null, response);
    });
  }

  octokit.authenticate({
    type: 'basic',
    username: username,
    password: password
  });

  octokit.repos.getContent({
    owner: username,
    repo: reponame,
    path: fileName
  }).then(function(a) {
      update(a && a.data?a.data.sha:null, fileName, content);
  }, function() {
    update(null, fileName, content);
  });
};
