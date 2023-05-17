import sys
import logging
from edgepi.gpio.gpio_constants import GpioPins
from edgepi.digital_output.edgepi_digital_output import EdgePiDigitalOutput

_logger=logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# create new DOUT instance
try:
    digital_output = EdgePiDigitalOutput()
except ModuleNotFoundError as e:
    _logger.error(f'Failed to load EdgePi modules: {e}')
    sys.exit(0)

# keep receiving commands from parent process
while True:
    try:
        # get input from js file
        inputs = input()

        # exit signal from parent process 
        if 'exit' in inputs:
            sys.exit(0)

        # parse input [input1,input2] -> [DOUT_Pin,state]
        inputs = inputs.split(',')

        # get channel enum and state
        DOUT_Pin = inputs[0]
        state = True if inputs[1].strip() == "true" else False

        # action on DOUT pin based on input gathered
        digital_output.digital_output_direction(GpioPins[DOUT_Pin], False)
        digital_output.digital_output_state(GpioPins[DOUT_Pin], state)
        
    except(EOFError, SystemExit, KeyboardInterrupt):
        sys.exit(0)