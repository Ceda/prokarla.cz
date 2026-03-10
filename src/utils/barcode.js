import JsBarcode from 'jsbarcode'

/**
 * Generate barcode as base64 data URL
 * @param {string} text - Text to encode in barcode
 * @returns {Promise<string>} Base64 data URL of barcode PNG
 */
export const generateBarcode = async (text) => {
  if (!text || !text.trim()) return ''

  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      JsBarcode(canvas, String(text), {
        format: 'CODE128',
        width: 2,
        height: 40,
        displayValue: false,
      })
      resolve(canvas.toDataURL('image/png'))
    } catch (error) {
      console.error('Barcode error:', error)
      resolve('')
    }
  })
}
