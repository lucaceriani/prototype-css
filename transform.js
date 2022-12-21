const rawGist = `
/***
laskdjf9as8djfalkdsfj
black background

*/

.body {
    background: #000;
    color: #fff;
    font-family: sans-serif;
    font-size: 16px;   
}

some-other-component {
    color: #fff;
    font-family: sans-serif;
    font-size: 16px;
    background: #000;
}

/* some commant */
/* some multi line comment
    cool
 */

/***
0a9s7doj21094ijdfsdf
white background
//www.google.com
*/

.body {
    background: #fff;
    color: #000;
    font-family: sans-serif;
}
`

/*
output format should be:
{
    id: string,
    name: string,
    urlMatch: string,
    cssRaw: string,
    options: {}
*/

const transform = (rawGist) => {
  return rawGist
    .split(/\/\*{3,}/)
    .map((blocks) => blocks.trim())
    .filter((blocks) => blocks.length > 0)
    .map((blocks) => blocks.split('\n').map((block) => block.trim()))
    .reduce((acc, block) => {
      const [id, name, urlMatch, _, maybeNewLine, ...cssRaw] = block
      return [...acc, { id, name, urlMatch, cssRaw: cssRaw.join('\n') }]
    }, [])
}

console.log(transform(rawGist))
