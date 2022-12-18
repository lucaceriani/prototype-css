import { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-scss'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/theme-nord_dark'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-keybinding_menu'

type Props = {
  defaultValue: string
}

export const CSSEditor = forwardRef(({ defaultValue }: Props, editorRef: ForwardedRef<AceEditor>) => {
  return (
    <AceEditor
      tabSize={2}
      width="100%"
      ref={editorRef}
      style={{ borderRadius: 'var(--border-radius)' }}
      mode="css"
      theme="nord_dark"
      enableLiveAutocompletion
      defaultValue={defaultValue}
      value={defaultValue}
      fontSize="16px"
    />
  )
})
