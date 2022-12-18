import { CSSProto } from './types'

const getCurrentTabId = async () =>
  new Promise<number>((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => resolve(tabs[0]?.id || 0))
  })

export const injectCss = async (cssProto: CSSProto) => {
  // insert a style element to the end of the head
  chrome.scripting.executeScript({
    target: { tabId: await getCurrentTabId() },
    // @ts-ignore
    func: (script: CSSProto) => {
      const style = document.createElement('style')
      style.setAttribute('data-source', 'CSS Prototype - ' + script.name)
      style.setAttribute('data-id', script.id)
      style.appendChild(document.createTextNode(script.cssRaw.replaceAll(';', ' !important;')))
      document.head.append(style)

      if (script.options.shadowDom) {
        ;[...document.body.querySelectorAll('*')]
          .filter((el) => el.shadowRoot)
          .forEach((elWithShadow) => elWithShadow.shadowRoot?.append(style.cloneNode(true)))
      }
    },
    args: [cssProto],
  })
}

export const removeCss = async (cssProto: CSSProto) => {
  // remove the style element
  chrome.scripting.executeScript({
    target: { tabId: await getCurrentTabId() },
    // @ts-ignore
    func: (script) => {
      document.head.querySelectorAll(`style[data-id="${script.id}"]`).forEach((style) => style?.remove())
      if (script.options.shadowDom) {
        ;[...document.body.querySelectorAll('*')]
          .filter((el) => el.shadowRoot)
          .forEach((elWithShadow) => elWithShadow.shadowRoot?.querySelector(`style[data-id="${script.id}"]`)?.remove())
      }
    },
    args: [cssProto],
  })
}
