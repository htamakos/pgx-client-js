/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

const request = require('request');
const cookie = require('cookie');

// helpers
const commonHelper = require('../helpers/common.js');

// services
const future = require('../services/future.js');

const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202
};

module.exports.HTTP_STATUS_CODES = HTTP_STATUS_CODES;

module.exports.doDel = function (url, session, item, withFuture, headers) {
  return new Promise(
    function(resolve, reject) {
      let options = Object.assign(session.baseDelRequest, { url: url });
      if(options.headers){
        options.headers['SID'] = session.sessionId;
      }

      if(headers && options.headers){
        Object.keys(headers).forEach(k => {
          options.headers[k] = headers[k];
        });
      }

      request(options, function(err, response, body) {
        let statusCode = response != null ? response.statusCode : null;
        if (!err && ((statusCode === HTTP_STATUS_CODES.OK) || (statusCode === HTTP_STATUS_CODES.CREATED) || (statusCode === HTTP_STATUS_CODES.ACCEPTED))) {
          if (withFuture) {
            future.getFuture(session, JSON.parse(body).futureId).then(function(result) {
              item = null;
              resolve(item);
            }, function(err) {
              reject(err);
            });
          } else {
            item = null;
            resolve(item);
          }
        } else {
          reject(commonHelper.createError(err, statusCode, body));
        }
      });
  });
}

module.exports.doPost = function (url, session, jsonContent, headers) {
  return new Promise(
    function(resolve, reject) {
      let localJson = {};
      if (jsonContent) {
        localJson = jsonContent;
      }
      localJson['_csrf_token'] = session.basePostRequest.json['_csrf_token'];
      let options = Object.assign(session.basePostRequest, { url: url, json: localJson });
      if(options.headers){
        options.headers['SID'] = session.sessionId;
      }

      if(headers && options.headers){
        Object.keys(headers).forEach(k => {
          options.headers[k] = headers[k];
        });
      }

      request(options, function(err, response, body) {
        let statusCode = response != null ? response.statusCode : null;
        if (!err && ((statusCode === HTTP_STATUS_CODES.OK) || (statusCode === HTTP_STATUS_CODES.CREATED)
            || (statusCode === HTTP_STATUS_CODES.ACCEPTED))) {
          future.getFuture(session, body.futureId).then(function(result) {
            resolve(result);
          }, function(err) {
            reject(err);
          });
        } else {
          reject(commonHelper.createError(err, statusCode, body));
        }
      });
  });
}

module.exports.doPut = function (url, session, jsonContent, headers) {
  return new Promise(
    function(resolve, reject) {
      let localJson = {};
      if (jsonContent) {
        localJson = jsonContent;
      }
      localJson['_csrf_token'] = session.basePutRequest.json['_csrf_token'];
      let options = Object.assign(session.basePutRequest, { url: url, json: localJson });
      if(options.headers){
        options.headers['SID'] = session.sessionId;
      }

      if(headers && options.headers){
        Object.keys(headers).forEach(k => {
          options.headers[k] = headers[k];
        });
      }

      request(options, function(err, response, body) {
        let statusCode = response != null ? response.statusCode : null;
        if (!err && ((statusCode === HTTP_STATUS_CODES.OK) || (statusCode === HTTP_STATUS_CODES.CREATED)
            || (statusCode === HTTP_STATUS_CODES.ACCEPTED))) {
          future.getFuture(session, body.futureId).then(function(result) {
            resolve(result);
          }, function(err) {
            reject(err);
          });
        } else {
          reject(commonHelper.createError(err, statusCode, body));
        }
      });
  });
}

module.exports.doPatch = function (url, session, jsonContent, headers) {
  return new Promise(
    function(resolve, reject) {
      let localJson = {};
      if (jsonContent) {
        localJson = jsonContent;
      }
      localJson['_csrf_token'] = session.basePatchRequest.json['_csrf_token'];
      let options = Object.assign(session.basePatchRequest, { url: url, json: localJson });
      if(options.headers){
        options.headers['SID'] = session.sessionId;
      }

      if(headers && options.headers){
        Object.keys(headers).forEach(k => {
          options.headers[k] = headers[k];
        });
      }

      request(options, function(err, response, body) {
        let statusCode = response != null ? response.statusCode : null;
        if (!err && ((statusCode === HTTP_STATUS_CODES.OK) || (statusCode === HTTP_STATUS_CODES.CREATED)
            || (statusCode === HTTP_STATUS_CODES.ACCEPTED))) {
          future.getFuture(session, body.futureId).then(function(result) {
            resolve(result);
          }, function(err) {
            reject(err);
          });
        } else {
          reject(commonHelper.createError(err, statusCode, body));
        }
      });
  });
}

module.exports.doGet = function (url, session, withFuture, headers) {
  return new Promise(
    function(resolve, reject) {
      let optionParams = { url: url };

      let options = Object.assign(session.baseGetRequest, optionParams);
      if(options.headers){
        options.headers['SID'] = session.sessionId;
      }

      if(headers && options.headers){
        Object.keys(headers).forEach(k => {
          options.headers[k] = headers[k];
        });
      }

      request(options, function(err, response, body) {
        let statusCode = response != null ? response.statusCode : null;
        if (!err && ((statusCode === HTTP_STATUS_CODES.OK) || (statusCode === HTTP_STATUS_CODES.CREATED)
            || (statusCode === HTTP_STATUS_CODES.ACCEPTED))) {
          if (withFuture) {
            future.getFuture(session, JSON.parse(body).futureId).then(function(result) {
              resolve(result);
            }, function(err) {
              reject(err);
            });
          } else {
            resolve(JSON.parse(body));
          }
        } else {
          reject(commonHelper.createError(err, statusCode, body));
        }});
  });
}

function getCookiesFromHeaderOrBrowser(response) {
  let headerField = 'set-cookie';
  if (response.headers && response.headers[headerField]) {
    return response.headers[headerField].toString();
  } else if (document) {
    return document.cookie;
  } else {
    return '';
  }
}

module.exports.getCookie = function(response, key) {
  let cookiesString = getCookiesFromHeaderOrBrowser(response);
  let cookies = cookie.parse(cookiesString);
  return cookies[key];
}
