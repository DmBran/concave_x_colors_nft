export const decodeToken = (tokenURI) => {
  try {
    const buff = new Buffer(tokenURI.split(',')[1], 'base64')
    const buffAscii = buff.toString('utf8')
    const buffImgData = buffAscii.split(',')[1]
    const buffImg64 = buffImgData.substring(0, buffImgData.length - 1)
    const buffImg = new Buffer(buffImg64, 'base64')
    const svg = buffImg.toString('utf8')
    const meta = JSON.parse(buffAscii)

    let rarity,
      theme,
      colors,
      syncCount = 0

    for (let i = 0; i < meta.attributes.length; ++i) {
      if (meta.attributes[i].trait_type === 'Colors') {
        colors = meta.attributes[i].value.split(',').filter((v) => v.length)
      }
      if (meta.attributes[i].trait_type === 'Rarity') {
        rarity = meta.attributes[i].value
      }
      if (meta.attributes[i].trait_type === 'Theme') {
        theme = meta.attributes[i].value
      }
      if (meta.attributes[i].trait_type === 'Resync_Count') {
        syncCount = meta.attributes[i].value
      }
    }

    return {
      syncCount,
      rarity,
      colors,
      theme,
      meta,
      svg,
    }
  } catch (e) {
    console.log(e)
    return {}
  }
}
