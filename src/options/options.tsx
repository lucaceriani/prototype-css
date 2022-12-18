import { useCallback, useEffect, useRef, useState } from 'react'
import { addCSSProto, deleteCSSProto, getAllCssProtos, updateCSSProto } from '../storage'
import { CSSProto } from '../types'
import { groupBy } from 'lodash'
import { useHash } from './hooks/useHash'
import { compileString as compileSass } from 'sass'
import { CSSEditor } from './cssEditor'
import AceEditor from 'react-ace'
import short from 'short-uuid'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ReactShadowRoot from 'react-shadow-root'
import prettier from 'prettier/standalone'
import cssParser from 'prettier/parser-postcss'

export const Options = () => {
  const urlCssId = useHash()

  const [allCssProtosByUrl, setAllCssProtosByUrl] = useState<{ [url: string]: CSSProto[] }>({})
  const [allCssProtosById, setAllCssProtosById] = useState<{ [id: string]: CSSProto[] }>({})

  const [protoName, setProtoName] = useState('')
  const [urlMatch, setUrlMatch] = useState('')

  const editorRef = useRef<AceEditor>(null)

  const updateProtos = () =>
    getAllCssProtos().then((cssProtos) => {
      setAllCssProtosByUrl(groupBy(cssProtos, 'urlMatch'))
      setAllCssProtosById(groupBy(cssProtos, 'id'))
    })

  useEffect(() => {
    // set the initiual value for the name of th cssprototype
    if (!allCssProtosById[urlCssId]) return
    setProtoName(allCssProtosById[urlCssId][0].name)
    setUrlMatch(allCssProtosById[urlCssId][0].urlMatch)
  }, [allCssProtosById, urlCssId])

  const saveProto = useCallback(async () => {
    const cssFromEditor = editorRef.current?.editor.getValue() || ''
    // beautify the css using prettier
    let formattedCss = cssFromEditor

    try {
      formattedCss = prettier.format(cssFromEditor, {
        parser: 'css',
        plugins: [cssParser],
      })
    } catch (error: any) {
      toast(
        <>
          Error in CSS!
          <br />
          <span style={{ opacity: 0.5 }}>Check console for details</span>
        </>,
        { type: 'error', autoClose: 2000, hideProgressBar: false }
      )
      // if formatting goes wrong i want to save the original css because
      // i do not want to lose work
    }

    // check if the cssproto exists
    if (!allCssProtosById[urlCssId]) {
      // if it does not exist create a new one
      const newProto: CSSProto = {
        id: short.generate(),
        name: protoName,
        urlMatch,
        cssRaw: formattedCss,
        cssCompiled: '',
        options: {},
      }
      await addCSSProto(newProto)
      // immediately navigate to the new hash
      location.hash = newProto.id
    } else {
      await updateCSSProto(urlCssId, {
        name: protoName,
        urlMatch,
        cssRaw: formattedCss,
      })
    }

    // update the list of protos
    await updateProtos()

    // show the toast
    toast(
      <>
        Saved!
        <br />
        <span style={{ opacity: 0.5 }}>{protoName}</span>
      </>,
      { type: 'success' }
    )
  }, [urlCssId, editorRef, protoName, updateProtos])

  const handleCrtlS = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        saveProto()
      }
    },
    [saveProto]
  )

  useEffect(() => {
    updateProtos()
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleCrtlS)
    return () => document.removeEventListener('keydown', handleCrtlS)
  }, [handleCrtlS])

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: '.3fr .7fr', paddingBottom: '2rem' }}>
        <div>
          <h4 style={{ marginBottom: '.5rem' }}>Prototypes</h4>
          {Object.keys(allCssProtosByUrl)
            .sort()
            .map((urlMatch) => (
              <div key={urlMatch} className="my-2">
                {urlMatch.length > 0 ? urlMatch : '[all websites]'}
                {(allCssProtosByUrl[urlMatch] || []).map((cssProto) => (
                  <div style={{ paddingLeft: '1rem' }}>
                    <a
                      href={'#' + cssProto.id}
                      style={{ color: cssProto.id == urlCssId ? 'var(--contrast)' : undefined }}
                    >
                      {cssProto.name}
                    </a>
                  </div>
                ))}
              </div>
            ))}
        </div>
        {/* -------------------------------------------------------------------------------- */}
        <div>
          <hgroup>
            <h4>Editor</h4>
            <h6>
              <small>{urlCssId}</small>
            </h6>
          </hgroup>
          <div className="grid">
            <label style={{ marginBottom: 0 }}>
              Name
              <input type="text" value={protoName} onChange={(e) => setProtoName(e.target.value)} required />
            </label>
            <label style={{ marginBottom: 0 }}>
              URL contains
              <input type="text" value={urlMatch} onChange={(e) => setUrlMatch(e.target.value)} required />
            </label>
            <div style={{ display: 'flex', alignItems: 'end', gap: '1rem' }}>
              <button
                onClick={() => saveProto()}
                style={{ width: 'initial', flexGrow: 1, marginBottom: 'var(--spacing)' }}
              >
                <i className="bi bi-save" /> Save
              </button>
              <button
                className="outline secondary"
                onClick={() => confirm('Delete "' + protoName + '" ?') && deleteCSSProto(urlCssId).then(updateProtos)}
                style={{ width: 'initial' }}
              >
                <i className="bi bi-trash" />
              </button>
            </div>
          </div>
          {allCssProtosById[urlCssId] ? (
            <CSSEditor value={allCssProtosById[urlCssId][0].cssRaw} ref={editorRef} />
          ) : (
            <CSSEditor ref={editorRef} />
          )}
        </div>
      </div>
      <ToastContainer
        closeButton={false}
        theme="dark"
        autoClose={500}
        toastStyle={{ backgroundColor: 'var(--muted-border-color)', borderRadius: 'var(--border-radius)' }}
        hideProgressBar
      />
    </>
  )
}
