import posthog from "posthog-js";
import { getBrowser } from "./extension";

export function initPosthog() {
    posthog.init("phc_BQHO9btvNLVEbFC4ihMIS8deK5T6P4d8EF75Ihvkfaw", {
        api_host: "https://e.lindylearn.io",
        loaded: (posthog) => {
            if (process.env.NODE_ENV === "development") {
                posthog.opt_out_capturing();
            }
        },
    });
}

export function reportEventPosthog(event: string, properties?: any) {
    if (process.env.NODE_ENV === "development") {
        return;
    }
    posthog.capture(event, properties);
}

export async function reportEventContentScript(name: string, data = {}) {
    getBrowser().runtime.sendMessage(null, {
        event: "reportEvent",
        name,
        data,
    });
}
