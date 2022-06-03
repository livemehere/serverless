'use strict';

module.exports.helloWorld = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
    }),
  };

  callback(null, response);
};

module.exports.getPosts = (event, context, callback) => {
  const posts = [
    {id:1,title:'post1',content:'hihi im content!'},
    {id:1,title:'post1',content:'hihi im content!'},
    {id:1,title:'post1',content:'hihi im content!'},
  ]
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      posts
    }),
  };

  callback(null, response);
};
