module.exports = function(RED) {
    RED.log.info("Nest dashboard element " + require('../package.json').version)
    var ui = undefined;
    function NEST(config) {
        try {
            var node = this;
            if (ui === undefined) {
                ui = RED.require("node-red-dashboard")(RED);
            }
            RED.nodes.createNode(node, config);
            var done = ui.addWidget({
                node: node,
                format: "<div>Lala</div>",
                templateScope: "local",
                group: config.group
            });
            // node status: https://nodered.org/docs/creating-nodes/status
        } catch (e) {
            console.log(e);
            this.error("Kaputt");
            node.error("Hit an error", e);
        }
        node.on("close", done);
    }
    RED.nodes.registerType("nest", NEST);
}
