export type CSSProto = {
  id: string
  name: string
  urlMatch: string
  cssRaw: string
  cssCompiled: string
  options: {
    active: boolean
    important?: boolean
    shadowDom?: boolean
  }
}
