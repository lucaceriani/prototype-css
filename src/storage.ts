import { CSSProto } from './types'

const getItem = async <T>(key: string): Promise<T | null> => {
  const item = await chrome.storage.local.get(key)
  return item[key] ? (JSON.parse(item[key]) as T) : null
}

const setItem = (key: string, value: any) => chrome.storage.local.set({ [key]: JSON.stringify(value) })

export const getSettings = () => getItem('settings')
export const getSites = () => getItem('sites')

export const setSettings = (settings: any) => setItem('settings', settings)

export const getAllCssProtos = () => getItem<CSSProto[]>('css-protos').then((res) => res || [])
export const addCSSProto = async (cssProto: CSSProto) => setItem('css-protos', [...(await getAllCssProtos()), cssProto])
export const deleteCSSProto = async (id: string) =>
  setItem(
    'css-protos',
    (await getAllCssProtos()).filter((cssProto) => cssProto.id != id)
  )

export const updateCSSProto = async (id: string, partialCssProto: Partial<CSSProto>) => {
  const cssProtos = await getAllCssProtos()
  const index = cssProtos.findIndex((cssProto) => cssProto.id == id)
  cssProtos[index] = { ...cssProtos[index], ...partialCssProto }
  setItem('css-protos', cssProtos)
}

export const setActive = async (id: string, active: boolean) => {
  const cssProtos = await getAllCssProtos()
  const index = cssProtos.findIndex((cssProto) => cssProto.id == id)
  cssProtos[index].options.active = active
  setItem('css-protos', cssProtos)
}
