module.exports = function(RED) {
    const spawn = require('child_process').spawn;

    // file_path to edgepi-thermocouple bash script for passing commands to Python script
    const executablePath = __dirname + '/edgepi-thermocouple'

    function ThermocoupleNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        function inputlistener(msg, send, done) {
            if (node.child != null) {
                // send input to child process using stdin (Py script)
                node.child.stdin.write(sampleCommand+"\n", () => {
                    if (done) { done(); }
                });
                node.status({fill:"green", shape:"dot", text:"input to child sent"});
                node.log(`edgepi-thermocouple: input to parent: ${msg.payload}`);
            }
            else {
                // logs error to Node-RED's console.
                node.status({fill:"red", shape:"ring", text:"disconnected from child"});
                node.error(RED._("edgepi-thermocouple:error:child.disconnected"), msg);
            }
            if (node.temperature) {
                msg.payload = node.temperature;
                send(msg);
            }
        }

        // creates child process instance which will run command located at executablePath
        // with the argument 2 (single-shot sample).
        sampleCommand = 2;
        node.child = spawn(executablePath, [sampleCommand]);

        // to-do: handle spawn error
        
        node.child ? node.status({fill:"green", shape:"ring", text:"connected to child"}) :
        node.status({fill:"red", shape:"ring", text:"connection to child failed"});

        // called on input to this node
        node.on("input", inputlistener);

        // listen to output from child process
        node.child.stdout.on('data', function (data) {
            // data is an arrayBuffer object
            node.temperature = parseFloat(data);
            node.log(`edgepi-thermocouple: child output: ${data}`);
        });

        node.child.stderr.on('data', function (data) {
            // Py logger prints to stderr
            if (data.includes("INFO"))
                node.log(data)
            else
                node.error(RED._(`edgepi-thermocouple:error:childprocess-stderr: ${data}`));
        });

        /* 
            This method handles close events emitted by the child process. On close,
            a numeric exit code is passed by the child process to the parent through the argument code.

            Exit Code: 0 -- child process exited with no error.
            Exit Code: Non-zero --child process exited with error.

            For a complete list of exit codes, please refer to https://node.readthedocs.io/en/latest/api/process/.
         */
        node.child.on("close", function(code) {
            node.child = null;
            if (node.finished) {
                node.finished();
                node.log(`edgepi-thermocouple: child process exit code: ${code}`);
                node.status({fill:"grey",shape:"ring",text:"child process closed."});
            }
            else {
                node.status({fill:"red",shape:"ring",text:"child process stopped before parent"});
                node.warn(RED._(`edgepi-thermocouple:warning: childprocess disconnected with exit code: ${code}`));
            }
        });

        // handle exit from parent process
        node.on("close", function(done) {
            node.status({fill:"grey", shape:"ring", text:"parent process terminated"});
            if (node.child != null) {
                node.finished = done;
                node.child.stdin.write("exit");
                node.child.kill(); 
                node.log("edgepi-thermocouple: exited parent process");
            }
            else { done(); }
        });
    }
    RED.nodes.registerType("edgepi-thermocouple-node", ThermocoupleNode);
}