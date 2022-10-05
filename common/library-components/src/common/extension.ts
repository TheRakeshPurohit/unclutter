// doesn't seem to work on page load
export function getBrowser(): any {
    // @ts-ignore
    return typeof browser !== "undefined" ? browser : chrome;
}
type BrowserType = "chromium" | "firefox";
function getBrowserType(): BrowserType {
    // @ts-ignore
    if (typeof browser !== "undefined") {
        return "firefox";
    } else {
        return "chromium";
    }
}

function getUnclutterExtensionId(): any {
    return getBrowserType() === "chromium"
        ? "ibckhpijbdmdobhhhodkceffdngnglpk"
        : "{8f8c4c52-216c-4c6f-aae0-c214a870d9d9}";
}
function getUnclutterLibraryExtensionId(): any {
    return getBrowserType() === "chromium"
        ? "bghgkooimeljolohebojceacblokenjn"
        : "{bb10288b-838a-4429-be0a-5268ee1560b8}";
}

// send a message to the Unclutter or Unclutter library extension
function sendMessage(message: object, toLibrary: boolean = false) {
    try {
        // preferrable send message to extension directly (https://developer.chrome.com/docs/extensions/mv3/messaging/#external-webpage)
        // this is the only way to send data from extension to extension
        getBrowser().runtime.sendMessage(
            toLibrary
                ? getUnclutterLibraryExtensionId()
                : getUnclutterExtensionId(),
            message
        );
    } catch (err) {
        // content script fallback
        window.postMessage(message, "*");
        // work around naming inconsistency in Unclutter 0.18.1
        window.postMessage(
            // @ts-ignore
            { ...message, type: message.event, event: null },
            "*"
        );
    }
}

export function openArticle(url: string, newTab: boolean = true) {
    sendMessage({
        event: "openLinkWithUnclutter",
        url,
        newTab,
    });
}

export function setUnclutterLibraryAuth(userId: string) {
    const message = {
        event: "setLibraryAuth",
        userId,
        webJwt: document.cookie, // requires disabled httpOnly flag, set via patch-package
    };

    // send to both extensions
    sendMessage(message);
    sendMessage(message, true);
}
