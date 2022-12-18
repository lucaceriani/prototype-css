import { isMatch } from 'matcher'
import { useEffect, useState } from 'react'
import { injectCss, removeCss } from '../inject'
import { getAllCssProtos, setActive } from '../storage'
import { CSSProto } from '../types'

export const Popup = () => {
  const openOptionsPage = () => chrome.runtime.openOptionsPage()

  const [url, setUrl] = useState<URL | null>(null)
  const [cssProtos, setCssProtos] = useState<CSSProto[]>([])

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabUrl = tabs[0].url
      if (!tabUrl) return
      setUrl(new URL(tabUrl))
    })
  }, [])

  useEffect(() => {
    if (!url) return
    updateProtos()
  }, [url])

  const updateProtos = () =>
    getAllCssProtos()
      .then((cssProtos) => cssProtos.filter((p) => url?.href.includes(p.urlMatch)))
      .then((cssProtos) => setCssProtos(cssProtos))

  const handleSwitch = async (cssProto: CSSProto) => {
    await setActive(cssProto.id, !cssProto.options.active)
    if (cssProto.options.active) removeCss(cssProto)
    else injectCss(cssProto)
    updateProtos()
  }

  return (
    <div style={{ padding: '1rem 0' }}>
      <hgroup>
        <h5 className="">CSS Scripts</h5>
        <h6>{url?.hostname}</h6>
      </hgroup>
      <div className="my-2">
        {cssProtos.map((cssProto) => (
          <div className="flex justify-between items-center">
            <label className="ellipsis">
              <input
                type="checkbox"
                role="switch"
                checked={cssProto.options.active}
                onChange={() => handleSwitch(cssProto)}
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
