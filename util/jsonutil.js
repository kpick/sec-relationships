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
            'id' : connected[i].id,
            'name' : connected[i].name,
            'role' : "HOST",
            'caption': "Name: " + connected[i].name + "  Vuln Score:" + connected[i].vulnScore
        });
        edges.push({
            'caption' : node.name + connected[i].name,
            'source' : node.id,
            'target' : connected[i].id
            })
    }
    console.log({'nodes': nodes, 'edges' : edges});
    return {'nodes': nodes, 'edges' : edges};
};