var neo4j = require('neo4j');
var db = require('./neoconnection').getDB();

// private constructor:

var Host = module.exports = function Host(_node) {
    // all we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

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
    set: function (name) {
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
        'MATCH (host) -[rel:owned]- (other)',
        'DELETE rel',
    ].join('\n')

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
        'RETURN host',
    ].join('\n');

    db.query(query, null, function (err, results) {
        if (err) return callback(err);
        var hosts = results.map(function (result) {
            return new User(result['host']);
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
        'RETURN host',
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

