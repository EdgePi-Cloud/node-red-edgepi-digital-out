module.exports = function (RED) {
  const rpc = require('@edgepi-cloud/edgepi-rpc')

  function DigitalOutNode(config) {
    // Create new node instance with config from last deploy
    RED.nodes.createNode(this, config);
    const node = this;

    // Get node properties from config
    node.DoutPin = config.DoutPin;
    node.DoutTriState = config.DoutTriState;
  
    // init new dout instance
    const dout = new rpc.DoutService()

    // called on input to this node
    node.on('input', async function(msg,send,done){
      // Ensure config
      if(!node.DoutPin || !node.DoutTriState){
        console.error("Please configure node")
        msg.payload = "Please configure node"
      }
      else{
        try{
          let response = await dout.set_dout_state(rpc.DoutPins[node.DoutPin], rpc.DoutTriState[node.DoutTriState]);
          msg.payload = response;
        }
        catch(error){
          msg.payload = error;
          console.error(error)
        }
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
