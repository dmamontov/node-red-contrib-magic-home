'use strict';

const { Control, Discovery } = require('magic-home');

module.exports = function (RED) {
    function devices(config) {
        RED.nodes.createNode(this, config);

        this.ip = config.ip;
        this.commandTimeout = config.commandtimeout;
        this.connectionTimeout = config.connectiontimeout;
        this.apply_masks = config.applymasks;
    }

    RED.httpAdmin.get("/magic-home/devices", RED.auth.needsPermission("magic.home.devices.read"), async function (req, res) {
        return res.json(await Discovery.scan(2000).then(devices => {
            return devices;

        }).catch(err => {
            RED.log.error(err.message);

            return {};
        }));
    });

    RED.httpAdmin.get("/magic-home/patterns", RED.auth.needsPermission("magic.home.patterns.read"), function (req, res) {
        return res.json(Control.patternNames);
    });

    RED.nodes.registerType("magic-home-devices", devices);
}

