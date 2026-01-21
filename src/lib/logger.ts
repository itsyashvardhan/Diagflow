/**
 * Minimalist Logger - Integrated with Diagflow's clean design philosophy
 * Only logs significant events in development, stays silent in production.
 */

const isDev = import.meta.env.DEV;

export const logger = {
    info: (message: string, ...args: any[]) => {
        if (isDev) {
            console.log(`%c[Diagflow]%c ${message}`, 'color: #f97316; font-weight: bold;', 'color: inherit;', ...args);
        }
    },
    warn: (message: string, ...args: any[]) => {
        if (isDev) {
            console.warn(`%c[Diagflow]%c ${message}`, 'color: #f97316; font-weight: bold;', 'color: inherit;', ...args);
        }
    },
    error: (message: string, ...args: any[]) => {
        // Errors are always logged for troubleshooting
        console.error(`%c[Diagflow Error]%c ${message}`, 'color: #ef4444; font-weight: bold;', 'color: inherit;', ...args);
    }
};
