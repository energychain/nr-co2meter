const CorrentlyClient = require("corrently-api");
const appid = "0x620417De577c7A0219e08929CF4F3A50039a5Aaa";

module.exports = function(RED) {
    function co2meter(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', async function(msg) {
            let clientConfig = {
                appid:appid,
                deviceid:"tz1"
            }
            let token = this.context().global.get("corrently-token");
            if((typeof config.personaltoken !== 'undefined') && (config.personaltoken !== null) && (config.personaltoken.length > 1)) {
                token = config.personaltoken;
            }
            if((typeof token !== 'undefined')&&(token !== null)) {
                clientConfig.token = token;
            }
            const client = new CorrentlyClient(clientConfig);
            let cou = {
                reading: 1 * msg.payload,
                zip: config.zip
            }
            let meterId =  this.context().get("meterId");
            if((typeof meterId !== "undefined")&&(meterId !== null)) {
                cou.meterId = meterId;
            }            
            const newMeter = await client.co2meter.createOrUpdate(cou);
            this.context().set("meterId",newMeter.meterId);
            this.context().global.set("corrently-token",client.token);
            
            let msg1 = JSON.parse(JSON.stringify(msg));
            msg1.payload = newMeter.co2;
            node.status({fill:"green",shape:"dot",text:(newMeter.co2/1000).toFixed(3) + "kg CO2eq"});
            let msg2 = JSON.parse(JSON.stringify(msg));
            msg2.payload = newMeter;
            node.send([msg1,msg2]);
        });
    }
    RED.nodes.registerType("co2meter",co2meter);
}