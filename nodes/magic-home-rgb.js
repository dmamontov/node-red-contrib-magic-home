'use strict';

const { Control } = require('magic-home');

module.exports = function(RED) {
    function rgb(config) {
        RED.nodes.createNode(this, config);

        this.control = new Control(config.device, {command_timeout: 10000, apply_masks: true});

        let node = this;

        node.on("input", function(msg, send, done) {
            node.control.setColor(
                msg.payload.r || 0,
                msg.payload.g || 0,
                msg.payload.b || 0
            )
            .then(state => {
                node.status({ fill: "green", shape: "ring", text: "ok" });

                node.send({payload: state, input: msg});
            }).catch(err => {
                node.status({ fill: "red", shape: "ring", text: "error" });

                node.error(err.message);
            });
        });
    }

    RED.nodes.registerType("magic-home-rgb", rgb);
}
