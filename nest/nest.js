module.exports = function(RED) {

    RED.log.info("Nest dashboard element " + require("../package.json").version)
    RED.nodes.registerType("nest", nest);

    function nest(config) {
        var node = this;
        RED.nodes.createNode(node, config);

        try {
            var ui = RED.require("node-red-dashboard")(RED);
            var html = require('fs').readFileSync(__dirname + '/nest_frontend.html', 'utf8');
            var done = ui.addWidget({
                node: node,
                format: html,
                templateScope: "local",
                group: config.group,
                forwardInputMessages: false,
                storeFrontEndInputAsState: false,
                beforeEmit: function(msg, value) {
                    console.dir(msg);
                    console.dir(value);
                    return msg;
                },
                // needs beforeSend to message contents to be sent back to runtime
                // beforeSend: function (msg, orig) {
                //     node.log("beforeSend: " + msg)
                //     if (orig) {
                //         return orig.msg + "X";
                //     }
                // },
                // beforeEmit: function(msg, value) {
                //     return { value:value + "X" };
                // },
                initController: function($scope, events) {
                    // console.dir($scope);
                    // console.dir(events);
                    events.on('update-value', function(data) {
                        console.dir(data);
                        // console.dir(nest);
                        if (data.topic == "ambient_temperature") {
                            nest.ambient_temperature = data.payload;
                        } if (data.topic == "target_temperature") {
                            nest.target_temperature = data.payload;
                        } if (data.topic == "hvac_state") {
                            nest.hvac_state = data.payload;
                        } if (data.topic == "has_leaf") {
                            nest.has_leaf = data.payload;
                        } if (data.topic == "away") {
                            nest.away = data.payload;
                        }
                    });
                }
            });
            node.status({fill: "green", shape: "ring", text: ""});
        } catch (e) {
            console.log(e);
            node.status({fill: "red", shape: "ring", text: e.message})
        }

        node.on('input', function(msg) {
            node.status({fill: "green", shape: "dot", text: msg.payload});
        });

        node.on("close", done);
    }
}
