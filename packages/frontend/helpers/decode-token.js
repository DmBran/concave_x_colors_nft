export const decodeToken = (tokenURI) => {
  try {
    let buff = new Buffer(tokenURI.split(',')[1], 'base64')
    let buffAscii = buff.toString('utf8').replace(/.\}\]\}/, '0}]}')
    let buffImgData = buffAscii.split(',')[1]
    let buffImg64 = buffImgData.substring(0, buffImgData.length - 1)
    let buffImg = new Buffer(buffImg64, 'base64')
    let svg = buffImg.toString('utf8')

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
