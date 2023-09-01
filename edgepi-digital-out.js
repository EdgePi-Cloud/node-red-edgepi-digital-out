module.exports = function (RED) {
  const rpc = require('@edgepi-cloud/edgepi-rpc')

  function DigitalOutNode(config) {
    // Create new node instance with user config
    RED.nodes.createNode(this, config);
    const node = this;
    const ipc_transport = "ipc:///tmp/edgepi.pipe"
    const tcp_transport = `tcp://${config.tcpAddress}:${config.tcpPort}`
    const transport = (config.transport === "Network") ? tcp_transport : ipc_transport;

    // Get node properties from config
    node.DoutPin = config.DoutPin;
    node.DoutTriState = config.DoutTriState;
  
    // init new dout instance
    const dout = new rpc.DoutService(transport)

    if (dout){
      console.debug("Digital Output node initialized on:", transport);
      node.status({fill:"green", shape:"ring", text:"d-out initialized"});
    }
    else{
      node.status({fill:"red", shape:"ring", text:"d-out failed to initialize"})
      throw new Error("Digital output failed to initialize.")
    }

    // Input event listener
    node.on('input', async function(msg,send,done){
      node.status({fill:"green", shape:"dot", text:"input recieved"});
      try{
        const response = await dout.setDoutState(rpc.DOUTPins[config.DoutPin], rpc.DoutTriState[config.DoutTriState]);
        msg.payload = response;
      }
      catch(error){
        msg.payload = error;
        console.error(error)
      }
      
      send(msg)
      
      if (done) {
        done();
      }
    });

  }
  
  RED.nodes.registerType('edgepi-digital-out-node', DigitalOutNode);
  
};
