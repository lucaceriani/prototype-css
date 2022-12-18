import { ForwardedRef, forwardRef } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/ext-keybinding_menu'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/mode-scss'
import 'ace-builds/src-noconflict/theme-nord_dark'
import 'ace-builds/src-noconflict/keybinding-vim'

type Props = {
  value?: string
}

export const CSSEditor = forwardRef(({ value }: Props, editorRef: ForwardedRef<AceEditor>) => {
  return (
    <AceEditor
      tabSize={2}
      height="512px"
      width="100%"
      ref={editorRef}
      style={{ borderRadius: 'var(--border-radius)' }}
      mode="css"
      // keyboardHandler="vim"
      theme="nord_dark"
      enableLiveAutocompletion
      value={value}
      fontSize="16px"
    />
  )
})
