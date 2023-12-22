module.exports = function (RED) {
  const rpc = require("@edgepi-cloud/edgepi-rpc");

  function DigitalOutNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    let channel = config.channel;
    let doutState = config.doutState;

    initializeNode(config).then((dout) => {
      node.on("input", async function (msg, send, done) {
        node.status({ fill: "green", shape: "dot", text: "input recieved" });
        try {
          channel = msg.channel ?? channel;
          doutState = msg.payload ?? doutState;
          msg = {
            payload: await dout.setDoutState(
              channel - 1,
              rpc.DoutTriState[doutState]
            ),
          };
        } catch (error) {
          msg = { payload: error };
          console.error(error);
        }
        send(msg);
        done?.();
      });
    });

    async function initializeNode(config) {
      const transport =
        config.transport === "Network"
          ? `tcp://${config.tcpAddress}:${config.tcpPort}`
          : "ipc:///tmp/edgepi.pipe";

      try {
        const dout = new rpc.DoutService(transport);
        console.info("Digital Output node initialized on:", transport);
        node.status({
          fill: "green",
          shape: "ring",
          text: "d-out initialized",
        });
        console.info(
          await dout.setDoutState(
            channel - 1,
            rpc.DoutTriState[config.doutState]
          )
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
