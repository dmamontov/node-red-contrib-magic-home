'use strict';

const { Control } = require('magic-home');

module.exports = function(RED) {
    function rgbcw(config) {
        RED.nodes.createNode(this, config);

        this.control = new Control(config.device, {command_timeout: 10000});

        let node = this;

        node.on("input", function(msg, send, done) {
            node.control.setColorAndWhites(
                    msg.payload.r || 0,
                    msg.payload.g || 0,
                    msg.payload.b || 0,
                    msg.payload.ww || 0,
                    msg.payload.cw || 0,
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

    RED.nodes.registerType("magic-home-rgbcw", rgbcw);
}
