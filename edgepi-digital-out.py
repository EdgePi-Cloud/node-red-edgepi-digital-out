import sys
import logging
from sdk.thermocouple import *

_logger=logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# arv[0] is this file's name, argv[1] should be numeric command
if len(sys.argv) > 1:
    try:
        dev = init_spi_dev()
    except ModuleNotFoundError as e:
        _logger.error(f'Failed to load SPI modules: {e}')
        sys.exit(0)
    
    spi = dev['spi']
    cs_line_4 = dev['cs']

    # keep receiving commands from parent process
    while True:
        try:
            cmd = input()
            # exit signal from parent process or user exit from child process
            if 'exit' in cmd or cmd == '0':
                spi.close()
                sys.exit(0)
            elif cmd == '1':
                dump_regs(spi, cs_line_4)
            elif cmd == '2':
                temp_reading = single_conversion(spi, cs_line_4)
                print(temp_reading)
            elif cmd == '3':
                disable_CJ(spi, cs_line_4)
            elif cmd == '4':
                enable_CJ(spi, cs_line_4)
            elif cmd == '5':
                CJ_override(spi, cs_line_4)
            elif cmd == '6':
                measure_and_save(spi, cs_line_4)
            elif cmd == '7':
                write_register(spi, cs_line_4)
            else:
                print(f'Invalid cmd = {cmd}')
        except(EOFError, SystemExit):
            if not spi is None:
                spi.close()
            sys.exit(0)
else:
    print("Number of commands must equal 2")
    