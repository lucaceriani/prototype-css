import { useEffect, useRef, useState } from 'react'
import { getAllCssProtos, updateCSSProto } from '../storage'
import { CSSProto } from '../types'
import { groupBy } from 'lodash'
import { useHash } from './hooks/hash'
import { compileString as compileSass } from 'sass'
import { CSSEditor } from './cssEditor'
import AceEditor from 'react-ace'
import short from 'short-uuid'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ReactShadowRoot from 'react-shadow-root'

export const Options = () => {
  const urlCssId = useHash()

  const [allCssProtosByUrl, setAllCssProtosByUrl] = useState<{ [url: string]: CSSProto[] }>({})
  const [allCssProtosById, setAllCssProtosById] = useState<{ [id: string]: CSSProto[] }>({})

  const nameRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<AceEditor>(null)

  const updateProtos = () =>
    getAllCssProtos().then((cssProtos) => {
      setAllCssProtosByUrl(groupBy(cssProtos, 'urlMatch'))
      setAllCssProtosById(groupBy(cssProtos, 'id'))
    })

  useEffect(() => {
    updateProtos()
  }, [])

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: '.3fr .7fr' }}>
        <div>
          <h4 style={{ marginBottom: '.5rem' }}>Prototypes</h4>
          <ul>
            {Object.keys(allCssProtosByUrl)
              .sort()
              .map((urlMatch) => (
                <li key={urlMatch}>
                  {urlMatch}
                  <ul>
                    {(allCssProtosByUrl[urlMatch] || []).map((cssProto) => (
                      <li key={cssProto.id}>
                        <a href={'#' + cssProto.id}>{cssProto.name}</a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '.5rem' }}>Editor</h4>
          <button
            className="my-2"
            onClick={() => {
              updateCSSProto(urlCssId, {
                name: nameRef.current?.value,
                cssRaw: editorRef.current?.editor.getValue(),
                //   cssCompiled: compileSass(cssRef.current?.value || '').css.toString(),
              })
                .then(updateProtos)
                .then(() => toast('Saved!', { type: 'success' }))
            }}
          >
            Save
          </button>
          <div>
            <label>
              <input
                type="text"
                defaultValue={allCssProtosById[urlCssId] && allCssProtosById[urlCssId][0].name}
                ref={nameRef}
                required
              />
            </label>
            {allCssProtosById[urlCssId] && (
              <CSSEditor defaultValue={allCssProtosById[urlCssId][0].cssRaw} ref={editorRef} />
            )}
          </div>
        </div>
      </div>
      <ToastContainer
        closeButton={false}
        theme="dark"
        autoClose={500}
        toastStyle={{ backgroundColor: '#fff2', borderRadius: 'var(--border-radius)' }}
        hideProgressBar
      />
    </>
  )
}
