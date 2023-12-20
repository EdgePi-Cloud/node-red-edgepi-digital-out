module.exports = function (RED) {
  const rpc = require("@edgepi-cloud/edgepi-rpc");

  function DigitalOutNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    setInitialConfigs(config).then((dout) => {
      node.on("input", async function (msg, send, done) {
        node.status({ fill: "green", shape: "dot", text: "input recieved" });
        try {
          const channel = "DOUT" + msg.channel.toString();
          msg.payload = await dout.setDoutState(
            rpc.DOUTPins[channel],
            rpc.DoutTriState[msg.state]
          );
        } catch (error) {
          msg.payload = error;
          console.error(error);
        }
        send(msg);
        if (done) {
          done();
        }
      });
    });

    async function setInitialConfigs(config) {
      const ipc_transport = "ipc:///tmp/edgepi.pipe";
      const tcp_transport = `tcp://${config.tcpAddress}:${config.tcpPort}`;
      const transport =
        config.transport === "Network" ? tcp_transport : ipc_transport;

      try {
        const dout = new rpc.DoutService(transport);
        console.info("Digital Output node initialized on:", transport);
        node.status({
          fill: "green",
          shape: "ring",
          text: "d-out initialized",
        });
        await dout.setDoutState(
          rpc.DOUTPins[config.DoutPin],
          rpc.DoutTriState[config.DoutTriState]
        );
        return dout;
      } catch (error) {
        console.error(error);
        node.status({
          fill: "red",
          shape: "ring",
          text: "Initialization error.",
        });
      }
    }
  }

  RED.nodes.registerType("digital-out", DigitalOutNode);
};
