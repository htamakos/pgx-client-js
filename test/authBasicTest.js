'use strict'

const pgx = require('../../main/javascript/pgx.js');
const url = "http://localhost:8080/pgx"

var path = require('path');
var fs = require('fs');

let options = {
  username: 'scott',
  password: 'tiger'
};
let p = pgx.connect(url, options);

let jsonContent = `{
                    "uri": "http://slc09iyv.us.oracle.com:8000/sample.adj",
                    "format": "adj_list",
                    "vertex_props": [{
                      "name": "prop1",
                      "type": "int"
                    }],
                    "edge_props": [{
                      "name": "cost",
                      "type": "double"
                    }],
                    "separator": " ",
                    "loading": {},
                    "error_handling": {}
                  }`;

p.then(function(session) {
  return session.readGraphWithProperties(jsonContent);
}).then(function(graph) {
  console.log(graph);
}).catch(function(err) {
  console.log("error: " + err);
});