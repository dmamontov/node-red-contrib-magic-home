'use strict';

const { Control } = require('magic-home');

module.exports = function(RED) {
    function on(config) {
        RED.nodes.createNode(this, config);

        this.control = new Control(config.device, {command_timeout: 10000});

        let node = this;

        node.on("input", function(msg, send, done) {
            (msg.payload === false ? this.control.turnOff() : this.control.turnOn())
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
