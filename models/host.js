var neo4j = require('neo4j');
var db = require('./neoconnection').getDB();

// private constructor:

var Host = module.exports = function Host(_node) {
    // all we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
};

// public instance properties:

Object.defineProperty(Host.prototype, 'id', {
    get: function () { return this._node.id; }
});

Object.defineProperty(Host.prototype, 'name', {
    get: function () {
        return this._node.data['name'];
    },
    set: function (name) {
        this._node.data['name'] = name;
    }
});

Object.defineProperty(Host.prototype, 'vulnScore', {
    get: function () {
        return this._node.data['vulnScore'];
    },
    set: function (vulnScore) {
        this._node.data['vulnScore'] = vulnScore;
    }
});


// public instance methods:

Host.prototype.save = function (callback) {
    this._node.save(function (err) {
        callback(err);
    });
};

Host.prototype.del = function (callback) {
    // use a Cypher query to delete both this host and any 
    // relationships in one transaction and one network request:
    // (note that this'll still fail if there are any relationships attached
    // of any other types, which is good because we don't expect any.)
    var query = [
        'MATCH (host:Host)',
        'WHERE ID(host) = {hostId}',
        'DELETE host',
        'WITH host',
        'MATCH (host) -[rel:connected]- (other)',
        'DELETE rel'
    ].join('\n');

    var params = {
        hostId: this.id
    };

    db.query(query, params, function (err) {
        callback(err);
    });
};

// ACTIONS


// static methods:

Host.get = function (id, callback) {
    db.getNodeById(id, function (err, node) {
        if (err) return callback(err);
        callback(null, new Host(node));
    });
};

Host.getAll = function (callback) {
    var query = [
        'MATCH (host:Host)',
        'RETURN host'
    ].join('\n');

    db.query(query, null, function (err, results) {
        if (err) return callback(err);
        var hosts = results.map(function (result) {
            return new Host(result['host']);
        });
        callback(null, hosts);
    });
};

// creates the host and persists (saves) it to the db, incl. indexing it:
Host.create = function (data, callback) {
    // construct a new instance of our class with the data, so it can
    // validate and extend it, etc., if we choose to do that in the future:
    	
	var node = db.createNode(data);
    var host = new Host(node);

    // but we do the actual persisting with a Cypher query, so we can also
    // apply a label at the same time. (the save() method doesn't support
    // that, since it uses Neo4j's REST API, which doesn't support that.)
    var query = [
        'CREATE (host:Host {data})',
        'RETURN host'
    ].join('\n');

    var params = {
        data: data
    };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var host = new Host(results[0]['host']);
        callback(null, host);
    });
};

Host.prototype.connect = function (other, callback) {
    this._node.createRelationshipTo(other._node, 'connected', {}, function (err, rel) {
        callback(err);
    });
};

Host.prototype.disconnect = function (other, callback) {
    var query = [
        'MATCH (host:Host) -[rel:connected]-> (other:Host)',
        'WHERE ID(host) = {hostId} AND ID(other) = {otherId}',
        'DELETE rel'
    ].join('\n');

    var params = {
        hostId: this.id,
        otherId: other.id
    };

    db.query(query, params, function (err) {
        callback(err);
    });
};

// calls callback w/ (err, following, others) where following is an array of
// hosts this host is connected to.
Host.prototype.getConnectedAndOthers = function (callback) {
    // query all hosts and whether we follow each one or not:
    var query = [
        'MATCH (host:Host), (other:Host)',
        'OPTIONAL MATCH (host) -[rel:connected]-> (other)',
        'WHERE ID(host) = {hostId}',
        'RETURN other, COUNT(rel)' // COUNT(rel) is a hack for 1 or 0
    ].join('\n');

    var params = {
        hostId: this.id
    };

    var host = this;
    db.query(query, params, function (err, results) {
        if (err) return callback(err);

        var connected = [];
        var others = [];

        for (var i = 0; i < results.length; i++) {
            var other = new Host(results[i]['other']);
            var cxns = results[i]['COUNT(rel)'];

            if (host.id === other.id) {
                continue;
            } else if (cxns) {
                connected.push(other);
            } else {
                others.push(other);
            }
        }
        callback(null, connected, others);
    });
};

// calls callback w/ (err, following, others) where following is an array of
// hosts this host is connected to.
Host.prototype.getConnected = function (callback) {
    // query all hosts and whether we follow each one or not:
    var query = [
        'MATCH (host:Host), (other:Host)',
        'OPTIONAL MATCH (host) -[rel:connected]-> (other)',
        'WHERE ID(host) = {hostId}',
        'RETURN other, COUNT(rel)' // COUNT(rel) is a hack for 1 or 0
    ].join('\n');

    var params = {
        hostId: this.id
    };

    var host = this;
    db.query(query, params, function (err, results) {
        if (err) return callback(err);

        var connected = [];
        var others = [];

        for (var i = 0; i < results.length; i++) {
            var other = new Host(results[i]['other']);
            var cxns = results[i]['COUNT(rel)'];

            if (host.id === other.id) {
                continue;
            } else if (cxns) {
                connected.push(other);
            }
        }
        callback(null, connected, others);
    });
};
