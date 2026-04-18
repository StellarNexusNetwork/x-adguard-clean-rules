// ==UserScript==
// @name         X.com 去零宽字符防规避
// @namespace    local-x-zero-width-clean
// @version      0.1.0
// @description  清理 X.com 推文/评论/用户名中的零宽字符，降低关键词规避
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  // 常见零宽/格式控制字符
  const INVISIBLE_RE =
    /[\u200B\u200C\u200D\u2060\uFEFF\u180E\u00AD\u034F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;

  // 只处理这些区域，尽量少碰别的
  const TARGET_SELECTOR = [
    '[data-testid="tweetText"]',
    '[data-testid="User-Name"]',
    '[data-testid="tweet"]',
    '[role="article"]'
  ].join(',');

  function normalizeText(text) {
    return typeof text === 'string' ? text.replace(INVISIBLE_RE, '') : text;
  }

  function cleanTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const oldValue = node.nodeValue;
    if (!oldValue || !INVISIBLE_RE.test(oldValue)) return;
    INVISIBLE_RE.lastIndex = 0;
    const newValue = oldValue.replace(INVISIBLE_RE, '');
    if (newValue !== oldValue) node.nodeValue = newValue;
  }

  function cleanNodeTree(root) {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
      cleanTextNode(root);
      return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE) return;

    const el = /** @type {Element} */ (root);

    const shouldScanSelf =
      el.matches(TARGET_SELECTOR) ||
      el.querySelector(TARGET_SELECTOR);

    if (!shouldScanSelf) return;

    const walker = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue || !INVISIBLE_RE.test(node.nodeValue)) {
            INVISIBLE_RE.lastIndex = 0;
            return NodeFilter.FILTER_SKIP;
          }
          INVISIBLE_RE.lastIndex = 0;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    let current;
    while ((current = walker.nextNode())) {
      textNodes.push(current);
    }

    for (const textNode of textNodes) {
      cleanTextNode(textNode);
    }
  }

  function cleanExisting() {
    document.querySelectorAll(TARGET_SELECTOR).forEach(cleanNodeTree);
  }

  let queued = false;
  function scheduleFullClean() {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      cleanExisting();
    });
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        cleanTextNode(mutation.target);
        continue;
      }

      for (const node of mutation.addedNodes) {
        cleanNodeTree(node);
      }
    }
  });

  function start() {
    cleanExisting();
    observer.observe(document.documentElement || document.body, {
      subtree: true,
      childList: true,
      characterData: true
    });

    // X 是 SPA，偶尔补扫一下
    setInterval(scheduleFullClean, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
