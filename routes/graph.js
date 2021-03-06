var Host = require('../models/host');
var jsonutil = require('../util/jsonutil');


exports.view = function (req, res) {
    res.render( 'graph',
        { "results": [
        ], "errors": []
        });
};

exports.render = function (req, res, next) {
    Host.get(req.params.id, function (err, host) {
        if (err) return next(err);
        host.getConnectedAndOthers(function (err, connected) {
            if (err) return next(err);
            res.send(jsonutil.convertToGraphJSON(host, connected));
        });
    });
};

//TODO: Need to figure out a way to recursively parse node's return in GraphJSON.
//For now, will fetch the node list and find all connections from that specific node.
exports.renderAll = function (req, res, next) {
    Host.getAll(function (err, hosts) {
        // Get All Hosts
        var nodeList = [];
        var edgeList = [];

        if (err) return next(err);
        var hostList = hosts;
        jsonutil.buildNodeList(hostList, nodeList);

        for (var i = 0; i < hostList.length; i++) {
            Host.get(req.params.id, function (err, host) {
                if (err) return next(err);
                host.getConnectedAndOthers(function (err, connected) {
                    if (err) return next(err);
                    jsonutil.buildEdgeList(host, connected, edgeList);
                });
            });
        }
    });
};

exports.test = function (req, res) {
	res.send({
	  "comment": "AlchemyJS contributors",
	  "nodes": [
	    {
	      "id": 0,
	      "caption": "AlchemyJS",
	      "role": "project",
	      "fun_fact": "built almost entirely in D3",
	      "root": true
	    },
	    {
	      "id": 1,
	      "caption": "Huston Hedinger",
	      "github": "hustonhedinger",
	      "role": "Maintainer",
	      "fun_fact": "hooligan"
	    },
	    {
	      "id": 2,
	      "caption": "Grace Andrews",
	      "github": "Grace-Andrews",
	      "role": "Maintainer",
	      "fun_fact": "was born left handed, now right handed."
	    },
	    {
	      "id": 3,
	      "caption": "Isabella Jorissen",
	      "github": "ifjorissen",
	      "role": "Maintainer",
	      "fun_fact": "knows a lot of digits of pi. Also loves pie."
	    },
	    {
	      "id": 4,
	      "caption": "Matt Cox",
	      "github": "MDCox",
	      "role": "Maintainer",
	      "fun_fact": "is not fun"
	    },
	    {
	      "id": 5,
	      "caption": "Dave Torbeck",
	      "github": "DaveTorbeck",
	      "role": "Contributor",
	      "fun_fact": ""
	    }
	  ],
	  "edges": [
	    {
	      "source": 1,
	      "target": 0,
	      "caption": "Maintains"
	    },
	    {
	      "source": 2,
	      "target": 0,
	      "caption": "Maintains"
	    },
	    {
	      "source": 3,
	      "target": 0,
	      "caption": "Maintains"
	    },
	    {
	      "source": 4,
	      "target": 0,
	      "caption": "Often Breaks"
	    },
	    {
	      "source": 5,
	      "target": 0,
	      "caption": "contributes"
	    }
	  ]
	});
};
