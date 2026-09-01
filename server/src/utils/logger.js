const isDev = process.env.NODE_ENV !== 'production';

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',

  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  // Bright Foreground colors
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
};

function getTimestamp() {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0];
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  return `${date} ${time}.${ms}`;
}

function formatMeta(meta) {
  if (!meta || Object.keys(meta).length === 0) return '';
  try {
    return ` ${COLORS.dim}${JSON.stringify(meta)}${COLORS.reset}`;
  } catch {
    return '';
  }
}

export const logger = {
  info(message, meta) {
    console.log(
      `${COLORS.dim}[${getTimestamp()}]${COLORS.reset} ${COLORS.brightBlue}${COLORS.bold}[INFO]${COLORS.reset}  ${message}${formatMeta(meta)}`
    );
  },

  success(message, meta) {
    console.log(
      `${COLORS.dim}[${getTimestamp()}]${COLORS.reset} ${COLORS.brightGreen}${COLORS.bold}[OK]${COLORS.reset}    ${COLORS.green}${message}${COLORS.reset}${formatMeta(meta)}`
    );
  },

  warn(message, meta) {
    console.warn(
      `${COLORS.dim}[${getTimestamp()}]${COLORS.reset} ${COLORS.brightYellow}${COLORS.bold}[WARN]${COLORS.reset}  ${COLORS.yellow}${message}${COLORS.reset}${formatMeta(meta)}`
    );
  },

  error(message, error, meta) {
    const errorDetails = error?.stack || error?.message || error || '';
    console.error(
      `${COLORS.dim}[${getTimestamp()}]${COLORS.reset} ${COLORS.brightRed}${COLORS.bold}[ERROR]${COLORS.reset} ${COLORS.red}${message}${COLORS.reset}${formatMeta(meta)}`
    );
    if (errorDetails) {
      console.error(`${COLORS.dim}${errorDetails}${COLORS.reset}`);
    }
  },

  http(method, path, status, duration, meta = {}) {
    let statusColor = COLORS.brightGreen;
    let statusSymbol = '✓';

    if (status >= 500) {
      statusColor = COLORS.brightRed;
      statusSymbol = '✗';
    } else if (status >= 400) {
      statusColor = COLORS.brightYellow;
      statusSymbol = '⚠';
    } else if (status >= 300) {
      statusColor = COLORS.brightCyan;
      statusSymbol = '→';
    }

    let methodColor = COLORS.cyan;
    switch (method) {
      case 'GET':
        methodColor = COLORS.brightBlue;
        break;
      case 'POST':
        methodColor = COLORS.brightGreen;
        break;
      case 'PUT':
      case 'PATCH':
        methodColor = COLORS.brightYellow;
        break;
      case 'DELETE':
        methodColor = COLORS.brightRed;
        break;
      default:
        methodColor = COLORS.magenta;
    }

    const durationStr = duration < 50 ? `${duration}ms` : duration < 200 ? `${duration}ms` : `${duration}ms ⚡`;
    const userStr = meta.user ? ` ${COLORS.dim}(user: ${meta.user})${COLORS.reset}` : '';
    const apiKeyStr = meta.apiKey ? ` ${COLORS.dim}(api-key: ${meta.apiKey})${COLORS.reset}` : '';
    const bodyStr = meta.bodySummary ? ` ${COLORS.dim}payload: ${meta.bodySummary}${COLORS.reset}` : '';

    console.log(
      `${COLORS.dim}[${getTimestamp()}]${COLORS.reset} ${COLORS.bold}${COLORS.magenta}[HTTP]${COLORS.reset}  ${statusColor}${statusSymbol}${COLORS.reset} ${methodColor}${COLORS.bold}${method.padEnd(6)}${COLORS.reset} ${path} ${statusColor}${COLORS.bold}${status}${COLORS.reset} ${COLORS.dim}${durationStr}${COLORS.reset}${userStr}${apiKeyStr}${bodyStr}`
    );
  },

  db(message, meta) {
    console.log(
      `${COLORS.dim}[${getTimestamp()}]${COLORS.reset} ${COLORS.brightMagenta}${COLORS.bold}[DB]${COLORS.reset}    ${message}${formatMeta(meta)}`
    );
  },

  auth(message, meta) {
    console.log(
      `${COLORS.dim}[${getTimestamp()}]${COLORS.reset} ${COLORS.brightCyan}${COLORS.bold}[AUTH]${COLORS.reset}  ${message}${formatMeta(meta)}`
    );
  },
};
