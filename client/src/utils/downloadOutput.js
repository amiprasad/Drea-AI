export const downloadOutput = async (content, filename, isImage = false) => {
  const response = isImage ? await fetch(content) : null

  if (response && !response.ok) {
    throw new Error('Download failed')
  }

  const blob = isImage
    ? await response.blob()
    : new Blob([content], { type: 'text/markdown;charset=utf-8' })

  const extension = isImage
    ? blob.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg'
    : 'md'

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.${extension}`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}