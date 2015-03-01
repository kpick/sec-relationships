var Jsonutil = module.exports;

Jsonutil.convertToGraphJSON = function(node, connected) {
    var nodes = [];
    var edges = [];
    nodes.push({
        'id' : node.id,
        'name' : node.name,
        'role' : "Root",
        'root': true,
        'caption': "Name: " + node.name + "  Vuln Score:" + node.vulnScore
    } );
    for (var i = 0; i < connected.length; i++) {
        nodes.push({
            'id': connected[i].id,
            'name': connected[i].name,
            'role': "HOST",
            'caption': "Name: " + connected[i].name + "  Vuln Score:" + connected[i].vulnScore
        });
        edges.push({
            'caption': node.name + connected[i].name,
            'source': node.id,
            'target': connected[i].id
        })
    }
    return {'nodes': nodes, 'edges' : edges};
};

Jsonutil.buildNodeList = function(nodes, nodeList) {
    console.log(nodes);
    for (var i = 0; i < nodes.length; i++) {
        nodeList.push({
            'id': nodes[i].id,
            'name': nodes[i].name,
            'role': "HOST",
            'caption': "Name: " + nodes[i].name + "  Vuln Score:" + nodes[i].vulnScore
        });
    }
    return nodeList;
};

Jsonutil.buildEdgeList = function(rootNode, ctdNodes, edgeList) {
    for (var i = 0; i < ctdNodes.length; i++) {
        edgeList.push({
            'caption': rootNode.name + ctdNodes[i].name,
            'source': rootNode.id,
            'target': ctdNodes[i].id
        })
    }
    return edgeList;
};

Jsonutil.addWrapper = function(nodeList, edgeList) {
    return {'nodes': nodeList, 'edges' : edgeList};
};


