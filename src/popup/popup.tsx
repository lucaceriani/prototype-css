import { useEffect, useState } from 'react'
import { Plus, Airplane } from 'react-bootstrap-icons'

export const Popup = () => {
  const openOptionsPage = () => chrome.runtime.openOptionsPage()

  const injectCss = (script: any) => {
    // insert a style element to the end of the head
    chrome.scripting.executeScript({
      target: { tabId },
      // @ts-ignore
      func: (script: any) => {
        const style = document.createElement('style')
        style.setAttribute('data-name', script.name)
        style.appendChild(document.createTextNode(script.style))
        document.head.append(style)
      },
      args: [script],
    })
  }

  const removeCss = (id: string) => {
    // remove the style element
    chrome.scripting.executeScript({
      target: { tabId },
      // @ts-ignore
      func: (id) => {
        document.head.querySelectorAll(`style[data-name="${id}"]`).forEach((style) => style && style.remove())
      },
      args: [id],
    })
  }

  const [url, setUrl] = useState<string>('')
  const [tabId, setTabId] = useState<number>(0)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url
      if (!url) return

      const hostname = new URL(url).hostname
      setUrl(hostname || '')
    })

    // save current tab id
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setTabId(tabs[0].id || 0)
    })
  }, [])

  const scripts = [
    {
      name: 'red-bg',
      style: 'body { background: red; }',
    },
    {
      name: 'green-color',
      style: '* { color: lime !important; }',
    },
  ]

  return (
    <div style={{ padding: '1rem 0' }}>
      <hgroup>
        <h5 className="">CSS Scripts</h5>
        <h6>{url}</h6>
      </hgroup>
      <div className="my-2">
        {scripts.map((script) => (
          <div className="flex justify-between items-center">
            <label className="ellipsis">
              <input
                type="checkbox"
                role="switch"
                onChange={(e: any) => (e.target.checked ? injectCss(script) : removeCss(script.name))}
              />
              {script.name}
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={openOptionsPage}
        className="center-center outline"
        style={{ fontSize: '1.5rem', padding: '.2rem' }}
      >
        <Plus />
      </button>
    </div>
  )
}
