'use strict';
const octokit = require('@octokit/rest')();

const username = process.env.REPO_UID;
const password = process.env.REPO_PWD;
const reponame = process.env.SITE_REPO;

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}
module.exports.updateContent = (event, context, callback) => {
  var content = event.content;

  if(!content && event.body) {
    var msg = (typeof event.body == "string") ? JSON.parse(event.body) : event.body;
    content = msg.content;
  }

  if(content) {
    content = content.trim();
  }

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
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          message: 'Changes upgraded successfully!',
          input: event,
        }),
      };

      callback(null, response);
    });
  });
};

module.exports.createPost = (event, context, callback) => {
  var content = event.content,
      name = event.name,
      createDate = event.date,
      title = event.title;

      
  if(!content && event.body) {
    var msg = (typeof event.body == "string") ? JSON.parse(event.body) : event.body;
    content = msg.content;
    name = msg.name;
    createDate = msg.date;
    title = msg.title;
  }

  if(content) {
    content = content.trim();
  }

  if(title) {
    title = title.trim();
  }
  
  var n = new Date();
  var fileName = name;
  if(!name) {
    name = n.getFullYear() + "-" + (n.getMonth() +1).pad(2) + "-" + n.getDate().pad(2) + "-" + title;
    createDate = n.toISOString();
  }

  fileName = "_posts/" + name + ".html";
  fileName = fileName.toLowerCase();
  fileName = fileName.replace(/\s+/g, "-");
  
  function update(sha, path, content) {
    octokit.repos.createFile({
      owner: username,
      repo: reponame,
      path: path,
      message: 'updating file',
      sha: sha,
      content: Buffer.from("---\r\nlayout: post\r\ntitle: \"" + title + "\"\r\ndate: " + createDate + "\r\nname: " + name + "\r\n---\r\n" + content + "").toString('base64')
    }).then(function(x) {

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type":"application/json",
          "Access-Control-Allow-Credentials": false
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
