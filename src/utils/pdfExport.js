import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

async function waitForImages(container) {
  const imgs = Array.from(container.querySelectorAll('img'))
  await Promise.all(
    imgs.map(img =>
      img.complete
        ? Promise.resolve()
        : new Promise(r => { img.onload = r; img.onerror = r })
    )
  )
}

async function elementToCanvas(element) {
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  })
}

/**
 * Download průvodka as PDF (A4 portrait).
 * Reads from the hidden #pruvodka-print-content element.
 */
export async function downloadPruvodkaPdf() {
  const printContent = document.getElementById('pruvodka-print-content')
  if (!printContent) return

  // 210mm at 96dpi ≈ 794px
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:white;'

  printContent.querySelectorAll('.pruvodka-page').forEach(el => {
    const clone = el.cloneNode(true)
    clone.style.width = '794px'
    clone.style.maxWidth = '794px'
    // Clip overflowing dots text at column boundaries
    clone.querySelectorAll('.row-name, .row-code').forEach(cell => {
      cell.style.overflow = 'hidden'
    })
    container.appendChild(clone)
  })

  document.body.appendChild(container)
  await waitForImages(container)

  const pdf = new jsPDF({ format: 'a4', unit: 'mm', orientation: 'portrait' })
  const pages = container.querySelectorAll('.pruvodka-page')

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage([210, 297], 'portrait')
    const canvas = await elementToCanvas(pages[i])
    const imgData = canvas.toDataURL('image/jpeg', 0.92)
    // Fit to A4 width, keep aspect ratio (content is usually shorter than 297mm)
    const pageHeightMm = Math.min(297, (canvas.height / canvas.width) * 210)
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, pageHeightMm)
  }

  document.body.removeChild(container)
  pdf.save('pruvodka-vraceni.pdf')
}

/**
 * Download shipping labels as PDF (A6 landscape, one label per page).
 * @param {string[]} generatedHtmls - array of label HTML strings from generateLabelHtml()
 */
export async function downloadLabelPdf(generatedHtmls) {
  if (!generatedHtmls?.length) return

  // 148mm × 105mm at 96dpi ≈ 560 × 397px
  const W_PX = 560
  const H_PX = 397

  const pdf = new jsPDF({ format: 'a6', unit: 'mm', orientation: 'landscape' })

  for (let i = 0; i < generatedHtmls.length; i++) {
    if (i > 0) pdf.addPage([148, 105], 'landscape')

    const container = document.createElement('div')
    container.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: ${W_PX}px;
      height: ${H_PX}px;
      background: white;
      font-family: Arial, sans-serif;
      box-sizing: border-box;
      overflow: hidden;
      padding: 19px; /* ~5mm */
    `
    // generatedHtmls[i] is the <div class="label">...</div> content
    container.innerHTML = generatedHtmls[i]

    document.body.appendChild(container)
    await waitForImages(container)

    const canvas = await elementToCanvas(container)
    const imgData = canvas.toDataURL('image/jpeg', 0.92)
    pdf.addImage(imgData, 'JPEG', 0, 0, 148, 105)

    document.body.removeChild(container)
  }

  pdf.save('prepravni-stitek.pdf')
}
