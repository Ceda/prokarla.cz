import JsBarcode from 'jsbarcode'

/**
 * Generate barcode as base64 data URL
 * @param {string} text - Text to encode in barcode
 * @returns {Promise<string>} Base64 data URL of barcode PNG
 */
export const generateBarcode = async (text) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      console.log('Canvas created:', canvas)

      JsBarcode(canvas, String(text), {
        format: 'CODE128',
        width: 2,
        height: 40,
        displayValue: false,
      })

      console.log('Barcode rendered to canvas')
      const dataUrl = canvas.toDataURL('image/png')
      console.log('Data URL created:', dataUrl?.substring(0, 50))
      resolve(dataUrl)
    } catch (error) {
      console.error('Barcode error:', error)
      reject(error)
    }
  })
}
