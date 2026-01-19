function LabelPreview({ htmls }) {
  if (!htmls?.length) return null

  return (
    <>
      {htmls.map((html, i) => (
        <div key={i} className="label-document" dangerouslySetInnerHTML={{ __html: html }} />
      ))}
    </>
  )
}

export default LabelPreview
