const EMOJIS = {
  color: '🎨',
  typography: '🖋 ',
  spacing: '📐',
  breakpoint: '🍪',
  success: '✅',
  error: '❌',
  warning: '⚠️',
  workingInProgress: '🚧'
};

const log = (message: string, emoji = '') => {
  // eslint-disable-next-line no-console
  console.log(`\n${message} ${emoji}`);
};

const logError = (message: string) => {
  // eslint-disable-next-line no-console
  console.error(`\n${EMOJIS.error} ${message}`);
};

const logWarning = (message: string) => {
  // eslint-disable-next-line no-console
  console.warn(`\n${EMOJIS.warning} ${message}`);
};

export { EMOJIS, log, logError, logWarning };
