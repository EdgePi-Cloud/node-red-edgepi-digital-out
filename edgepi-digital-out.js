module.exports = function (RED) {
  const rpc = require('@edgepi-cloud/edgepi-rpc')

  function DigitalOutNode(config) {
    // Create new node instance with config from last deploy
    RED.nodes.createNode(this, config);
    const node = this;
    const ipc_transport = "ipc:///tmp/edgepi.pipe"
    const tcp_transport = `tcp://${config.tcpAddress}:${config.tcpPort}`
    const transport = (config.transport === "Network") ? tcp_transport : ipc_transport;

    // Get node properties from config
    node.DoutPin = config.DoutPin;
    node.DoutTriState = config.DoutTriState;
  
    // init new dout instance
    const dout = new rpc.DoutService()

    // called on input to this node
    node.on('input', async function(msg,send,done){
      // Ensure config
      
      try{
        let response = await dout.set_dout_state(rpc.DoutPins[node.DoutPin], rpc.DoutTriState[node.DoutTriState]);
        msg.payload = response;
      }
      catch(error){
        msg.payload = error;
        console.error(error)
      }
      
      send(msg)

      
    });

    node.on('close', (done) => {
      node.status({ fill: 'grey', shape: 'ring', text: 'digital-out node terminated' });
      done();
    });
  }
  
  RED.nodes.registerType('edgepi-digital-out-node', DigitalOutNode);
  
};
