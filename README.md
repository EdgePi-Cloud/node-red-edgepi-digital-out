# node-red-edgepi-digital-out

## EdgePi digital output node

EdgePi digital output node that configures the state of a given output channel.

## Install
Install normally through the node-red editor or install with npm in your node-red directory
(typically located  at `~/node.red`) by running the following command:
```
npm install @edgepi-cloud/node-red-edgepi-digital-out
```

### Properties
- **RPC Server**<br> 
The connection to your EdgePi's RPC Server.
- **Channel**<br>
The channel being configured.
- **State**<br>
The state to set the selected channel to.

### Inputs
- **payload** *string*<br>
The D-OUT state.
- **channel** *number*<br>

### Outputs
- **payload** *string*<br>
A success message stating the configured channel's changed state.


