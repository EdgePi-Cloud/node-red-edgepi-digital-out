# node-red-edgepi-digital-out

# Using Node Red
...

# Installing this node
1. git clone this repository
2. Change to project directory: $ cd node-red-edgepi-digital-out
3. Install dependencies: $ npm install
4. Change to .node-red directory: $ cd ~/.node-red
5. $ npm install path_to_project_directory

# Troubleshooting
* Note: upon being deployed, this node will run a bash executable to install Python module dependencies. The executable may not have the necessary file permissions to perform these operations. If an error* related to file permissions is encountered, enter the following in the project directory, in order to give the bash script execute permission:
    - `$ chmod +x edgepi-thermocouple`
*Use if you encounter an error such as the following:
```
EACCES
    at Process.ChildProcess._handle.onexit (node:internal/child_process:285:19)
    at onErrorNT (node:internal/child_process:485:16)
    at processTicksAndRejections (node:internal/process/task_queues:83:21)
```
