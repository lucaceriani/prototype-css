/// <reference types="chrome-types" />

import { getAllProtosForUrl } from './src/storage'
import { injectCss } from './src/inject'

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status == 'complete' && tab.active) {
    const url = new URL(tab.url!)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return
    ;(await getAllProtosForUrl(url.href)).filter((p) => p.isActive).forEach((p) => injectCss(p, tabId))
  }
})
