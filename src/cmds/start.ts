export const command = 'start <service>';
export const desc = 'Starts services';
export function builder(yargs) {
  return yargs.commandDir('start');
}
export function handler(argv) {}
