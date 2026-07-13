export function insertImagesEvenly(content: string, imageUrls: string[]): string {
  if (imageUrls.length === 0) return content

  const paragraphs = content.split(/\n\n+/).filter(p => p.trim())
  const paragraphCount = paragraphs.length

  if (paragraphCount <= 1) return content  // 太短不插图（避免末尾）

  // 最多插入 min(3, 图片数, 段落数-1) 张（避免在最后一段后）
  const insertCount = Math.min(3, imageUrls.length, paragraphCount - 1)

  if (insertCount <= 0) return content

  // 计算每张图的插入位置（均匀分布在段落之间，不在末尾）
  const insertPositions: number[] = []
  for (let j = 0; j < insertCount; j++) {
    const pos = Math.round(((paragraphCount - 1) * (j + 1)) / insertCount)
    insertPositions.push(Math.min(Math.max(pos - 1, 0), paragraphCount - 2))  // 0-indexed，最多到倒数第二段后
  }

  const result: string[] = []
  let imgIndex = 0

  paragraphs.forEach((para, i) => {
    result.push(para)
    // 在指定位置插入图片
    if (imgIndex < insertCount && i === insertPositions[imgIndex]) {
      result.push(`\n![配图${imgIndex + 1}](${imageUrls[imgIndex]})\n`)
      imgIndex++
    }
  })

  return result.join('\n\n')
}
