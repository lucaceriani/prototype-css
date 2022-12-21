/// <reference types="chrome-types" />
import { getAllCssProtos } from './src/storage'
import { injectCss } from './src/inject'

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status == 'complete' && tab.active) {
    const url = new URL(tab.url!)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return

    const protos = await getAllCssProtos()
    console.log('protos', protos)
    protos
      .filter((proto) => proto.isActive && url.href.match(proto.urlMatch))
      .forEach((proto) => injectCss(proto, tabId))
  }
})
