import fs from 'fs'
import path from 'path'

export interface Video {
  slug: string
  title: string
  description: string
  category: string
  date: string
  videoUrl: string
  coverImage: string
  duration: string
}

const VIDEOS_DIR = path.join(process.cwd(), 'src', 'content', 'videos')

function ensureDir() {
  if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true })
  }
}

function parseVideoFile(raw: string): Video | null {
  try {
    return JSON.parse(raw) as Video
  } catch {
    return null
  }
}

export function getAllVideos(): Video[] {
  ensureDir()
  const files = fs.readdirSync(VIDEOS_DIR).filter(f => f.endsWith('.json'))

  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(VIDEOS_DIR, file), 'utf-8')
      return parseVideoFile(raw)
    })
    .filter((v): v is Video => v !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getVideoBySlug(slug: string): Video | null {
  ensureDir()
  const filePath = path.join(VIDEOS_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  return parseVideoFile(raw)
}

export function saveVideo(video: Video): void {
  ensureDir()
  const filePath = path.join(VIDEOS_DIR, `${video.slug}.json`)
  fs.writeFileSync(filePath, JSON.stringify(video, null, 2), 'utf-8')
}

export function deleteVideo(slug: string): void {
  ensureDir()
  const filePath = path.join(VIDEOS_DIR, `${slug}.json`)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function generateVideoSlug(title: string): string {
  return slugify(title) || `video-${Date.now()}`
}
