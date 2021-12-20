import atob from 'atob'

export const decodeToken = (tokenURI) => {
  try {
    console.log(atob(tokenURI.replace('data:application/json;base64,', '')))
    const meta = atob(tokenURI.replace('data:application/json;base64,', ''))
    const svg = atob(
      meta.image.replace('data:image/svg+xml;base64,', '')
    ).replace('<svg', '<svg viewbox="0 0 500 500"')
    const colors = []
    let rarity, theme
    for (let i = 0; i < meta.attributes.length; ++i) {
      if (meta.attributes[i].name === 'Colors') {
        colors.push(meta.attributes[i].value.split(',').filter((v) => v.length))
      }
      if (meta.attributes[i].name === 'Rarity') {
        rarity = meta.attributes[i].value
      }
      if (meta.attributes[i].name === 'Theme') {
        theme = meta.attributes[i].value
      }
    }

    return {
      rarity,
      theme,
      meta,
      svg,
    }
  } catch (e) {
    console.log(e)
    return {}
  }
}
