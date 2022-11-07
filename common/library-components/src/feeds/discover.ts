import { JSDOM } from "jsdom";
import Parser from "rss-parser";
const parser = new Parser();

const FEED_TYPES = [
    "application/atom+xml",
    "application/json",
    "application/rdf+xml",
    "application/rss+xml",
    "application/x.atom+xml",
    "application/x-atom+xml",
    "text/atom+xml",
    "text/plain",
    "text/rdf+xml",
    "text/rss+xml",
    "text/xml",
];

export async function getMainFeed(sourceUrl: string): Promise<Parser.Output<{}> | null> {
    const feeds = await discoverFeeds(sourceUrl);
    for (const feedUrl of feeds) {
        try {
            const feed = await parser.parseURL(feedUrl);
            if (feed.items.length > 0) {
                return feed;
            }
        } catch (e) {
            console.error(e);
        }
    }
    return null;
}

export async function discoverFeeds(sourceUrl: string): Promise<string[]> {
    // adapted from https://github.com/adbar/trafilatura/blob/aa0f0a55ec40b0d9347a771bbeed9e4f5ef72dd9/trafilatura/feeds.py and https://github.com/DIYgod/RSSHub-Radar/blob/master/src/js/content/utils.js

    // not required in content script
    const html = await fetch(sourceUrl).then((response) => response.text());
    const document: Document = new JSDOM(html).window.document;
    if (!document) {
        console.error("Invalid HTML");
        return [];
    }

    let feedUrls: string[] = [];

    // parse HTML
    document.querySelectorAll("link[href]").forEach((link: HTMLLinkElement) => {
        if (link.type && FEED_TYPES.includes(link.type)) {
            feedUrls.push(link.href);
        } else if (link.href.includes("rss") || link.href.includes("atom")) {
            feedUrls.push(link.href);
        }
    });
    if (feedUrls.length === 0) {
        document.querySelectorAll("a[href]").forEach((link: HTMLAnchorElement) => {
            if (
                [".rss", ".rdf", ".xml", ".atom"].some((end) =>
                    link.href.toLowerCase().endsWith(end)
                )
            ) {
                feedUrls.push(link.href);
            } else if (link.href.includes("rss") || link.href.includes("atom")) {
                feedUrls.push(link.href);
            }
        });
    }

    // filter out invalid URLs
    feedUrls = feedUrls
        .map((url) => {
            if (url.startsWith("/")) {
                return new URL(url, new URL(sourceUrl).origin).href;
            }
            if (url === sourceUrl) {
                return null;
            }
            if (url.includes("comments")) {
                return null;
            }
            try {
                new URL(url);
            } catch {
                return null;
            }
            return url;
        })
        .filter((url) => url !== null) as string[];

    // TODO also consider
    // RSSHub rules, see https://github.com/DIYgod/RSSHub-Radar/blob/master/src/js/common/radar-rules.js
    // hosted rss-proxy, see https://github.com/damoeb/rss-proxy/
    // Google News search, see trafilatura

    return feedUrls;
}

export function getHumanPostFrequency(feed: Parser.Output<{}> | null): string | null {
    if (!feed) {
        return null;
    }

    const start = feed.items[feed.items.length - 1].isoDate;
    if (!start) {
        return null;
    }
    const end = new Date();
    const days = Math.round((end.getTime() - new Date(start).getTime()) / (24 * 60 * 60 * 60));

    const articlesPerDay = Math.round(feed.items.length / days);
    if (articlesPerDay >= 1) {
        return `${articlesPerDay} article${articlesPerDay !== 1 ? "s" : ""} per day`;
    }
    const articlesPerWeek = Math.round(feed.items.length / (days / 7));
    if (articlesPerWeek >= 1) {
        return `${articlesPerWeek} article${articlesPerWeek !== 1 ? "s" : ""} per week`;
    }
    const articlesPerMonth = Math.round(feed.items.length / (days / 30));
    if (articlesPerMonth >= 1) {
        return `${articlesPerMonth} article${articlesPerMonth !== 1 ? "s" : ""} per month`;
    }
    const articlesPerYear = Math.round(feed.items.length / (days / 365));
    if (articlesPerYear >= 1) {
        return `${articlesPerYear} article${articlesPerYear !== 1 ? "s" : ""} per year`;
    }

    return null;
}