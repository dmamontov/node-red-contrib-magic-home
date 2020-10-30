'use strict';

const { Control, CustomMode } = require('magic-home');

module.exports = function(RED) {
    function pattern(config) {
        RED.nodes.createNode(this, config);

        this.control = new Control(config.device, {command_timeout: 10000});
        this.pattern = config.pattern;
        this.speed = config.speed;

        let node = this;

        node.on("input", function(msg, send, done) {
            if ('custom' in msg && 'type' in msg && msg.custom && msg.type) {
                let customPattern = new CustomMode();

                for (const [key, value] of Object.entries(msg.custom)) {
                    customPattern.addColor(value[0], value[1], value[2]);
                }

                customPattern.setTransitionType(msg.type);

                this.control.setCustomPattern(customPattern, msg.speed || node.speed)
                    .then(state => {
                        node.status({ fill: "green", shape: "ring", text: "ok" });

                        node.send({payload: state, input: msg});
                    }).catch(err => {
                        node.status({ fill: "red", shape: "ring", text: "error" });

                        node.error(err.message);
                    });
            } else {
                if (node.pattern && node.speed) {
                    this.control.setPattern(msg.pattern || node.pattern, msg.speed || node.speed)
                        .then(state => {
                            node.status({ fill: "green", shape: "ring", text: "ok" });

                            node.send({payload: state, input: msg});
                        }).catch(err => {
                            node.status({ fill: "red", shape: "ring", text: "error" });

                            node.error(err.message);
                        });
                }
            }
        });
    }

    RED.nodes.registerType("magic-home-pattern", pattern);
}
