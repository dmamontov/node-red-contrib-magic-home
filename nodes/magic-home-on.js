'use strict';

const { Control } = require('magic-home');

module.exports = function(RED) {
    function on(config) {
        RED.nodes.createNode(this, config);

        this.device = config.device;
        this.deviceNode = RED.nodes.getNode(this.device);

        this.control = new Control(
            this.deviceNode.ip,
            {
                connect_timeout: parseInt(this.deviceNode.connectionTimeout),
                command_timeout: parseInt(this.deviceNode.commandTimeout),
                apply_masks: this.deviceNode.apply_masks
            }
        );

        let node = this;

        node.on("input", function(msg, send, done) {
            (msg.payload === false ? node.control.turnOff() : node.control.turnOn())
                .then(state => {
                    node.status({ fill: "green", shape: "ring", text: "ok" });

                    node.send({payload: state, input: msg});
                }).catch(err => {
                    node.status({ fill: "red", shape: "ring", text: "error" });

                    node.error(err.message);
                });
        });
    }

    RED.nodes.registerType("magic-home-on", on);
}
