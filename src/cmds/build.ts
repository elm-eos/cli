export const command = 'build <filetype>';
export const describe = 'Builds files';
export function builder(yargs) {
  return yargs.commandDir('build');
}
export function handler(argv) {}
