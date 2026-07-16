import { NextRequest, NextResponse } from 'next/server'
import { getAllVideos, saveVideo, deleteVideo, generateVideoSlug, type Video } from '@/lib/videos'
import { requireAdmin } from '@/lib/session'

export async function GET() {
  try {
    const videos = getAllVideos()
    return NextResponse.json({ videos })
  } catch (error) {
    console.error('List videos error:', error)
    return NextResponse.json({ error: '读取失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAdmin(request)
    if ('error' in auth) return auth.error

    const body = await request.json()
    const { title, description, category, videoUrl, coverImage, duration, slug: existingSlug } = body

    if (!title || !videoUrl) {
      return NextResponse.json({ error: '标题和视频不能为空' }, { status: 400 })
    }

    const slug = existingSlug || generateVideoSlug(title)
    const date = new Date().toISOString().split('T')[0]

    const video: Video = {
      slug,
      title,
      description: description || '',
      category: category || '融资知识',
      date,
      videoUrl,
      coverImage: coverImage || '',
      duration: duration || '',
    }

    saveVideo(video)

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error('Save video error:', error)
    return NextResponse.json({ error: '保存失败' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAdmin(request)
    if ('error' in auth) return auth.error

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: '缺少slug' }, { status: 400 })
    }

    if (!/^[a-z0-9][a-z0-9\-]*$/.test(slug)) {
      return NextResponse.json({ error: '无效的slug' }, { status: 400 })
    }

    deleteVideo(slug)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete video error:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
