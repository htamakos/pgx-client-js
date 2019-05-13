'use strict'

const assert = require('assert');
const common = require('./common.js');
const pgx = common.pgx;

let p = null;
let localSession = null;

before(function() {
  p = pgx.connect(common.baseUrl, common.options).then(function(session) {
    localSession = session;
    return session.readGraphWithProperties(common.graphEdgeLabelJson);
  }).then(function(graph) {
    return graph.getEdge(0);
  });
});

describe('edgeLabel', function () {
  it('should return a label', function() {
    return p.then(function(edge) {
      return edge.label;
    }).then(function(label) {
      assert.equal("labelEdge0", label);
    });
  });
});

after(function() {
  localSession.destroy().then(function(result) {
    p = null;
    localSession = null;
  });
});