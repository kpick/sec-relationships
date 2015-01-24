// hosts.js
// Routes to CRUD users.

var Host = require('../models/host');

/**
 * GET /hosts
 */
exports.list = function (req, res, next) {
    Host.getAll(function (err, hosts) {
        if (err) return next(err);
        res.render('hosts', {
            hosts: hosts
        });
    });
};

/**
 * POST /hosts
 */
exports.create = function (req, res, next){
    Host.create({
        name: req.body['name'],
		vulnScore: req.body['vulnScore']
    }, function (err, host) {
        if (err) return next(err);
        res.redirect('/hosts/' + host.id);
    });
};

/**
 * GET /hosts/:id
 */
exports.show = function (req, res, next) {
    Host.get(req.params.id, function (err, host) {
        if (err) return next(err);
        // TODO also fetch and show followers? (not just follow*ing*)
        host.getConnectedAndOthers(function (err, connected, others) {
            if (err) return next(err);
            res.render('host', {
                host: host,
                connected: connected,
                others: others
            });
        });
    });
};

/**
 * POST /hosts/:id
 */
exports.edit = function (req, res, next) {
    Host.get(req.params.id, function (err, host) {
        if (err) return next(err);
        host.name = req.body['name'];
        host.save(function (err) {
            if (err) return next(err);
            res.redirect('/hosts/' + host.id);
        });
    });
};

/**
 * DELETE /hosts/:id
 */
exports.del = function (req, res, next) {
    Host.get(req.params.id, function (err, host) {
        if (err) return next(err);
        host.del(function (err) {
            if (err) return next(err);
            res.redirect('/hosts');
        });
    });
};

/**
 * POST /hosts/:id/connect
 */
exports.connect = function (req, res, next) {
    Host.get(req.params.id, function (err, user) {
        if (err) return next(err);
        Host.get(req.body.host.id, function (err, other) {
            if (err) return next(err);
            user.connect(other, function (err) {
                if (err) return next(err);
                res.redirect('/hosts/' + host.id);
            });
        });
    });
};

/**
 * POST /users/:id/unfollow
 */
exports.disconnect = function (req, res, next) {
    Host.get(req.params.id, function (err, host) {
        if (err) return next(err);
        Host.get(req.body.host.id, function (err, other) {
            if (err) return next(err);
            host.disconnect(other, function (err) {
                if (err) return next(err);
                res.redirect('/hosts/' + host.id);
            });
        });
    });
};