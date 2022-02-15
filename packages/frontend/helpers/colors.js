import TheColors from '../artifacts/TheColors.json'
import TestColors from '../data/colors-ropsten.json'
import Colors from '../data/colors.json'

export const hexToRgb = function hexToRgb(hex) {
  if (!hex) return
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

export const getHexColor = async function (tokenID, context) {
  if (context.networkId === 1337) {
    const contract = new context.library.eth.Contract(
      TheColors.abi,
      process.env.NEXT_PUBLIC_COLORS_CONTRACT
    )
    return await contract.methods.getHexColor(tokenID)
  }
  const ourColors = context.networkId === 3 ? TestColors : Colors
  return ourColors[tokenID] ? ourColors[tokenID][2] : '#000000'
}

export const hslToRgb = function hslToRgb(h, s, l) {
  var r, g, b

  if (s == 0) {
    r = g = b = l // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

export const rgbToHsl = function ({ r, g, b }) {
  /* Getting the Max and Min values for Chroma. */
  var max = Math.max.apply(Math, [r, g, b])
  var min = Math.min.apply(Math, [r, g, b])

  /* Variables for HSV value of hex color. */
  var chr = max - min
  var hue = 0
  var val = max
  var sat = 0

  if (val > 0) {
    /* Calculate Saturation only if Value isn't 0. */
    sat = chr / val
    if (sat > 0) {
      if (r == max) {
        hue = 60 * ((g - min - (b - min)) / chr)
        if (hue < 0) {
          hue += 360
        }
      } else if (g == max) {
        hue = 120 + 60 * ((b - min - (r - min)) / chr)
      } else if (b == max) {
        hue = 240 + 60 * ((r - min - (g - min)) / chr)
      }
    }
  }

  return {
    h: hue,
    s: sat,
    l: chr,
  }
}
