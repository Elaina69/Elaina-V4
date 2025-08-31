const CONSOLE_STYLE = {
    prefix: '%c Elaina ',
    css: 'color: #ffffff; background-color: #f77fbe',
};

const createLogger = (type: 'log' | 'warn' | 'error') => {
    return (message: any, ...args: any[]) => {
        console[type](CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);
    };
};

export const log = createLogger('log');
export const warn = createLogger('warn');
export const error = createLogger('error');

// Export theme log globally
window.log = log
window.warn = warn
window.error = error