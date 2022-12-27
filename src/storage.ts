import { CSSProto } from './types'

export const setItem = (key: string, value: any) => chrome.storage.local.set({ [key]: JSON.stringify(value) })
export const getItem = async <T>(key: string): Promise<T | null> => {
  const item = await chrome.storage.local.get(key)
  return item[key] ? (JSON.parse(item[key]) as T) : null
}

export const getSettings = () => getItem('settings')
export const setSettings = (settings: any) => setItem('settings', settings)
export const getSites = () => getItem('sites')

export const getAllProtos = () => getItem<CSSProto[]>('css-protos').then((res) => res || [])

export const getAllProtosForUrl = async (url: string) =>
  getAllProtos().then((cssProtos) =>
    cssProtos.filter((p) => p.urlMatch.split(/, */).some((singleUrlMatch) => url.includes(singleUrlMatch)))
  )

export const getAllProtosById = async () => {
  const cssProtos = await getAllProtos()
  return cssProtos.reduce((acc: { [id: string]: CSSProto }, cssProto) => ({ ...acc, [cssProto.id]: cssProto }), {})
}

export const addProto = async (cssProto: CSSProto) => setItem('css-protos', [...(await getAllProtos()), cssProto])
export const deleteProto = async (id: string) =>
  setItem(
    'css-protos',
    (await getAllProtos()).filter((cssProto) => cssProto.id != id)
  )

export const updateProto = async (id: string, partialCssProto: Partial<CSSProto>) => {
  console.log('updateCSSProto', id, partialCssProto)

  const cssProtos = await getAllProtos()
  const index = cssProtos.findIndex((cssProto) => cssProto.id == id)
  cssProtos[index] = { ...cssProtos[index], ...partialCssProto }
  console.log(cssProtos)

  return setItem('css-protos', cssProtos)
}

export const setActive = async (id: string, active: boolean) => {
  const cssProtos = await getAllProtos()
  const index = cssProtos.findIndex((cssProto) => cssProto.id == id)
  cssProtos[index].isActive = active
  return setItem('css-protos', cssProtos)
}

export const bulkUpdateOrCreate = async (cssProtos: CSSProto[]) => {
  const allProtos = await getAllProtosById()
  for (const proto of cssProtos) {
    if (allProtos[proto.id]) await updateProto(proto.id, proto)
    else await addProto(proto)
  }
}

export const importFromUrl = async (url: string) => {
  // fetch the gist content
  const rawGist = await fetch(url).then((res) => res.text())
  const cssProtos = transformGist(rawGist)
  return bulkUpdateOrCreate(cssProtos)
}

export const transformGist = (rawGist: string) =>
  rawGist
    .split(/\/\*{3,}/)
    .map((blocks) => blocks.trim())
    .filter((blocks) => blocks.length > 0)
    .map((blocks) => blocks.split('\n'))
    .reduce((acc: CSSProto[], blockLines) => {
      const [id, name, urlMatch, _, maybeLF, ...cssRaw] = blockLines
      return [
        ...acc,
        {
          id: id.trim(),
          name: name.trim(),
          urlMatch: urlMatch.trim(),
          cssRaw: (maybeLF == '\n' ? '' : maybeLF) + cssRaw.join('\n'),
        },
      ]
    }, [])

const cssProtos: CSSProto[] = [
  {
    id: '1',
    urlMatch: 'https://www.google.com/',
    name: 'Google',
    cssRaw: 'body { background-color: red; }',
    cssCompiled: 'body { background-color: red; }',
    isActive: true,
  },
  {
    id: '2',
    urlMatch: 'https://luca.gg/',
    name: 'Google 2',
    cssRaw: 'body { background-color: blue; }',
    cssCompiled: 'body { background-color: blue; }',
    isActive: true,
  },
]

// setItem('css-protos', cssProtos)
