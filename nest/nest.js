module.exports = function(RED) {
    var HTML = String.raw`
<div id="{{'thermostat-WZ_'+$id}}">Text: {{msg.payload}}</div>
`;

    RED.log.info("Nest dashboard element " + require("../package.json").version)
    RED.nodes.registerType("nest", nest);

    function nest(config) {
        var node = this;
        RED.nodes.createNode(node, config);

        try {
            var ui = RED.require("node-red-dashboard")(RED);
            var done = ui.addWidget({
                node: node,
                format: HTML,
                templateScope: "local",
                group: config.group,
                forwardInputMessages: false,
                storeFrontEndInputAsState: false
            });
            // node status: https://nodered.org/docs/creating-nodes/status
            node.status({fill: "green", shape: "dot", text: "initialised"});
        } catch (e) {
            console.log(e);
            this.error("Kaputt");
            node.error("Hit an error", e);
            node.status({fill: "red", shape: "ring", text: e.message})
        }

        node.on('input', function(msg) {
            node.log("Received: " + msg.payload);
            node.status({fill: "green", shape: "dot", text: msg.payload});
        });

        node.on("close", done);
    }
}
