export const decodeToken = (tokenURI) => {
  try {
    const buff = new Buffer(tokenURI.split(',')[1], 'base64')
    const buffAscii = buff.toString('utf8')
    const buffImgData = buffAscii.split(',')[1]
    const buffImg64 = buffImgData.substring(0, buffImgData.length - 1)
    const buffImg = new Buffer(buffImg64, 'base64')
    const svg = buffImg.toString('utf8')
    const meta = JSON.parse(buffAscii)
    const svg64 = `data:image/svg+xml;base64,${buffImg64}`
    let rarity,
      sigil,
      colors = [],
      syncCount = 0

    for (let i = 0; i < meta.attributes.length; ++i) {
      if (/^Color/.test(meta.attributes[i].trait_type)) {
        if (meta.attributes[i].value) {
          colors.push(meta.attributes[i].value)
        }
      }
      if (meta.attributes[i].trait_type === 'Rarity') {
        rarity = meta.attributes[i].value
      }
      if (meta.attributes[i].trait_type === 'Sigil') {
        sigil = meta.attributes[i].value
      }
      if (meta.attributes[i].trait_type === 'Resyncs') {
        syncCount = meta.attributes[i].value
      }
    }

    return {
      syncCount,
      rarity,
      colors,
      sigil,
      svg64,
      meta,
      svg,
    }
  } catch (e) {
    console.log(e)
    return {}
  }
}
