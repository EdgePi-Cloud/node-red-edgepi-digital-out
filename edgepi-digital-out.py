import sys
import logging
from edgepi.gpio.gpio_constants import GpioPins
from edgepi.digital_output.edgepi_digital_output import EdgePiDigitalOutput

_logger=logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# arv[0] is this file's name, argv[1] should be numeric command
if len(sys.argv) > 1:
    try:
        digital_output = EdgePiDigitalOutput()
    except ModuleNotFoundError as e:
        _logger.error(f'Failed to load EdgePi modules: {e}')
        sys.exit(0)
    
    # keep receiving commands from parent process
    while True:
        try:
            cmd = input()
            # exit signal from parent process or user exit from child process
            if 'exit' in cmd or cmd == '0':
                sys.exit(0)
            elif cmd == '5':
                digital_output.digital_output_direction(GpioPins.DOUT4, False)
                digital_output.digital_output_state(GpioPins.DOUT4, False)
                print("Hello")
        except(EOFError, SystemExit, KeyboardInterrupt):
            sys.exit(0)
else:
    print("Number of commands must equal 2")
    