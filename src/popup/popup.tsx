import { useEffect, useState } from 'react'
import { CSSProto } from '../types'
import { injectCss, removeCss } from '../inject'
import { getAllCssProtos } from '../storage'

export const Popup = () => {
  const openOptionsPage = () => chrome.runtime.openOptionsPage()

  const [url, setUrl] = useState<string>('')
  const [cssProtos, setCssProtos] = useState<CSSProto[]>([])

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url
      if (!url) return

      const hostname = new URL(url).hostname
      setUrl(hostname || '')
    })

    // get all css prototypes
    getAllCssProtos().then((cssProtos) => setCssProtos(cssProtos))
  }, [])

  return (
    <div style={{ padding: '1rem 0' }}>
      <hgroup>
        <h5 className="">CSS Scripts</h5>
        <h6>{url}</h6>
      </hgroup>
      <div className="my-2">
        {cssProtos.map((cssProto) => (
          <div className="flex justify-between items-center">
            <label className="ellipsis">
              <input
                type="checkbox"
                role="switch"
                onChange={(e: any) => (e.target.checked ? injectCss(cssProto) : removeCss(cssProto))}
              />
              {cssProto.name}
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={openOptionsPage}
        className="center-center outline"
        style={{ fontSize: '1.5rem', padding: '.2rem', lineHeight: 1 }}
      >
        <i className="bi bi-plus" />
      </button>
    </div>
  )
}
