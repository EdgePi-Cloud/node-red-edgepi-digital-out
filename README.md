# node-red-edgepi-digital-out

## EdgePi digital output node

EdgePi digital output node that configures the state of a given output channel.

### Properties
- **RPC Server**<br> 
The connection to your EdgePi's RPC Server.
- **Channel**<br>
The channel you want to configure.
- **State**<br>
The state you want to set the selected channel to.

### Inputs
Any message can be used to trigger this node.

### Outputs
- **payload** *string*<br>
A success message stating the configured channel's changed state.
