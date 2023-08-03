# node-red-edgepi-digital-out

## Installation: Node-Red on Debian
Install a supported version of Node.js: https://nodered.org/docs/faq/node-versions
```
    $ sudo apt install curl
    $ curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    $ sudo apt install nodejs
```
   Verify Node.js installed: 
```
$ node -v
```
Verify npm installed: 
```
$ npm -v
```
3. Install Node-Red with npm
```
$ cd ~
$ sudo npm install -g --unsafe-perm node-red
```

4. Install Node Red Dashboard
```
$ cd ~/.node-red
$ npm i node-red-dashboard
```

## Installation of this node
```
$ npm install @edgepi-cloud/node-red-edgepi-digital-out
```

## Running Node-Red
```
$ node-red
```