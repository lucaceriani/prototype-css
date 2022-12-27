import { isMatch } from 'matcher'
import { useEffect, useState } from 'react'
import { injectCss, removeCss } from '../inject'
import { getAllProtos, getAllProtosForUrl, setActive } from '../storage'
import { CSSProto } from '../types'
import short from 'short-uuid'

export const Popup = () => {
  // const openOptionsPage = () => chrome.runtime.openOptionsPage()
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

  const updateProtos = () => getAllProtosForUrl(url!.href).then((cssProtos) => setCssProtos(cssProtos))

  const handleSwitch = async (cssProto: CSSProto) => {
    await setActive(cssProto.id, !cssProto.isActive)
    if (cssProto.isActive) removeCss(cssProto)
    else injectCss(cssProto)
    updateProtos()
  }

  return (
    <>
      <div style={{ padding: '1rem 0' }}>
        <hgroup>
          <h5>
            <img src="icons/128.png" style={{ height: '1em', verticalAlign: '-0.1em' }} /> Kiss my CSS
            <a
              href=""
              onClick={(e) => {
                e.preventDefault()
                chrome.runtime.openOptionsPage()
              }}
              style={{ float: 'right' }}
            >
              <i className="bi bi-gear" />
            </a>
          </h5>
          <h6>{url?.hostname}</h6>
        </hgroup>
        <div className="my-2">
          {cssProtos.map((proto) => (
            <div style={{ display: 'flex' }}>
              <label className="ellipsis" style={{ marginRight: 'auto' }}>
                <input type="checkbox" role="switch" checked={proto.isActive} onChange={() => handleSwitch(proto)} />
                {proto.name}
              </label>
              <a href={'options.html#' + proto.id} target="_blank">
                <i className="bi bi-pencil" />
              </a>
            </div>
          ))}
        </div>
        <a
          href={`options.html#${short.generate()}=//${url?.hostname}`}
          role="button"
          className="center-center outline"
          style={{ fontSize: '1.5rem', padding: '.2rem', lineHeight: 1 }}
          target="_blank"
        >
          <i className="bi bi-plus" />
        </a>
      </div>
    </>
  )
}
