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
                // convert: function(payload, oldValue, msg) {
                //     // console.log("convert");
                //     // console.dir(arguments);
                //     // console.dir(msg);
                //     return msg;
                // },
                // beforeEmit: function(msg, value) {
                //     // console.log("beforeEmit");
                //     // console.dir(arguments);
                //     // console.dir(msg);
                //     // console.dir(value);
                //     // We need the new value including some topic. See below.
                //     //return {topic: msg.topic, value: value};
                //     return {topic: msg.topic, value: value};
                // },
                // convertBack: function(value) {
                //     console.log("convertBack");
                //     console.dir(arguments);
                //     return value;
                // },
                // beforeSend: function(msg) {
                //     console.log("beforeSend");
                //     console.dir(arguments);
                // },
                initController: function($scope, events) {
                    var nest = undefined;
                    var elementID = '#nest_' + $scope.$id;
                    $(elementID).ready(function() {
                        var divElement = $(elementID).get(0);
                        nest = new thermostatDial(divElement, {
                            // FIXME needs to be tested
                            // onSetTargetTemperature: function(v) {
                            //     scope.send({topic: "target_temperature", payload: v});
                            // }
                        });
                    });
                    $scope.$watch('msg', function(data, oldVal, scope) {
                        if (data) {
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
                        }
                    });
                }
            });
            // TODO empty text string needs a single whitespace otherwise some strange error occurs:
            // key 'node-red-contrib-ui-nest/NEST: (de)' returned an object instead of string.
            node.status({fill: "green", shape: "ring", text: ' '});
        } catch (e) {
            console.log(e);
            node.status({fill: "red", shape: "ring", text: e.message})
        }

        node.on("close", done);
    }
}
