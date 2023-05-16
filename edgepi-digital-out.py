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

# node channel property to SDK enum
channels = {"dout1": GpioPins.DOUT1, "dout2": GpioPins.DOUT2, "dout3": GpioPins.DOUT3, "dout4": GpioPins.DOUT4,
"dout5": GpioPins.DOUT5, "dout6":GpioPins.DOUT6, "dout7":GpioPins.DOUT7, "dout8": GpioPins.DOUT8}

# keep receiving commands from parent process
while True:
    try:
        # parse input from js file
        inputs = input().split(",")
        # get channel enum
        channel = channels[inputs[0]]
        # get on/off
        on_off = True if inputs[1].strip() == "true" else False

        # action on by input gathered
        digital_output.digital_output_direction(channel, False)
        digital_output.digital_output_state(channel, on_off)
        
    except(EOFError, SystemExit, KeyboardInterrupt):
        sys.exit(0)