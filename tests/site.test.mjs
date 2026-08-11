import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { pages, site } from "../site/site.config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(root, "site-dist");

function routeFile(route) {
  return path.join(outputRoot, route === "/" ? "" : route.slice(1), "index.html");
}

function matches(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

function decodeHtml(value) {
  return value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'");
}

test("site configuration defines one canonical source per route", () => {
  assert.equal(new Set(pages.map(({ route }) => route)).size, pages.length);
  assert.equal(new Set(pages.map(({ source }) => source)).size, pages.length);
  assert.equal(new Set(pages.map(({ title }) => title)).size, pages.length);
  assert.equal(new Set(pages.map(({ description }) => description)).size, pages.length);
  for (const page of pages) {
    assert.match(page.route, /^\/(?:.*\/)?$/);
    assert.ok(page.description.length >= 90 && page.description.length <= 165, page.route);
  }
});

test("every canonical page has accessible structure and complete metadata", async () => {
  const canonicals = [];
  for (const page of pages) {
    const html = await readFile(routeFile(page.route), "utf8");
    assert.match(html, /^<!doctype html>/);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<a class="skip-link" href="#main-content">/);
    assert.match(html, /<main class="article" id="main-content">/);
    assert.match(html, /<nav class="side-nav" aria-label="Guide navigation">/);
    assert.match(html, /<meta name="viewport"/);
    assert.match(html, /<meta name="description" content="[^\"]{90,165}">/);
    assert.match(html, /<meta name="robots" content="index,follow/);
    assert.doesNotMatch(html, /<meta name="keywords"/i);
    assert.equal(matches(html, /<h1(?:\s[^>]*)?>(.*?)<\/h1>/gs).length, 1, page.route);
    assert.equal(matches(html, /<link rel="canonical" href="([^"]+)">/g).length, 1, page.route);
    assert.match(html, /<a href="[^"]+">View source<\/a>/);
    assert.match(html, /The repository remains the source of truth\./);
    assert.match(html, /Updated <time datetime="\d{4}-\d{2}-\d{2}">/);
    assert.match(html, /<dialog class="search-dialog"/);
    assert.match(html, /<meta property="og:image"/);
    const canonical = matches(html, /<link rel="canonical" href="([^"]+)">/g)[0];
    assert.equal(canonical, `${site.url}${page.route}`);
    canonicals.push(canonical);
    const structuredData = matches(html, /<script type="application\/ld\+json">(.*?)<\/script>/gs);
    assert.equal(structuredData.length, 2, page.route);
    for (const document of structuredData) assert.doesNotThrow(() => JSON.parse(document));
  }
  assert.equal(new Set(canonicals).size, pages.length);
});

test("generated internal links, assets, and anchors resolve", async () => {
  for (const page of pages) {
    const file = routeFile(page.route);
    const html = await readFile(file, "utf8");
    const attributes = matches(html, /(?:href|src)="([^"]+)"/g).map(decodeHtml);
    for (const value of attributes) {
      if (!value || value.startsWith("#") || /^(?:https?:|mailto:|data:|\/\/)/.test(value)) continue;
      const match = value.match(/^([^?#]*)(?:\?[^#]*)?(#.*)?$/);
      const targetPath = match?.[1] || "";
      const fragment = match?.[2]?.slice(1) || "";
      const target = path.resolve(path.dirname(file), decodeURIComponent(targetPath));
      assert.ok(target === outputRoot || target.startsWith(`${outputRoot}${path.sep}`), `${page.route}: ${value}`);
      let resolved = target;
      const targetStat = await stat(target);
      if (targetStat.isDirectory()) resolved = path.join(target, "index.html");
      await access(resolved);
      if (fragment && resolved.endsWith(".html")) {
        const targetHtml = await readFile(resolved, "utf8");
        const decodedFragment = decodeURIComponent(fragment);
        assert.match(targetHtml, new RegExp(`id=["']${decodedFragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`), `${value} from ${page.route}`);
      }
    }
  }
});

test("sitemap, crawler policy, and machine index cover the public guide", async () => {
  const [sitemap, robots, llms] = await Promise.all([
    readFile(path.join(outputRoot, "sitemap.xml"), "utf8"),
    readFile(path.join(outputRoot, "robots.txt"), "utf8"),
    readFile(path.join(outputRoot, "llms.txt"), "utf8"),
  ]);
  const sitemapUrls = matches(sitemap, /<loc>(.*?)<\/loc>/g);
  for (const page of pages) {
    const canonical = `${site.url}${page.route}`;
    assert.equal(sitemapUrls.filter((url) => url === canonical).length, 1, canonical);
    assert.match(llms, new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(robots, /User-agent: \*/);
  for (const crawler of ["OAI-SearchBot", "Claude-SearchBot", "Claude-User", "Google-Extended"]) {
    assert.match(robots, new RegExp(`User-agent: ${crawler}\\nAllow: /`));
  }
  assert.match(robots, new RegExp(`Sitemap: ${site.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap\\.xml`));
});

test("site output is self-contained and free of retired or local references", async () => {
  for (const required of [
    "assets/site.css",
    "assets/site.js",
    "assets/search-index.json",
    "assets/fde-guide-banner.svg",
    "assets/fde-guide-social.png",
    "assets/favicon.svg",
    "assets/mermaid.min.js",
    "404.html",
    ".nojekyll",
  ]) {
    await access(path.join(outputRoot, required));
  }
  const files = await Promise.all(pages.map(({ route }) => readFile(routeFile(route), "utf8")));
  const combined = files.join("\n");
  const placeholderPattern = new RegExp(
    `\\b(?:${[["FIX", "ME"], ["TB", "D"], ["TO", "DO"], ["X", "XX"]].map((parts) => parts.join("")).join("|")}|lorem ipsum)\\b`,
    "i",
  );
  assert.doesNotMatch(combined, /production-agent-engineering/);
  assert.doesNotMatch(combined, /\/Users\/|file:\/\//);
  assert.doesNotMatch(combined, placeholderPattern);
  assert.doesNotMatch(combined, /SEO|keyword stuffing|GEO|AEO/i);
});
