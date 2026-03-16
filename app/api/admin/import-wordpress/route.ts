import { NextRequest, NextResponse } from 'next/server'
import { importWordPressXml } from '@/lib/wordpress-import'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') ?? formData.get('xml')
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided. Upload a WordPress WXR export (XML) file.' },
        { status: 400 }
      )
    }

    if (!file.name.toLowerCase().endsWith('.xml')) {
      return NextResponse.json(
        { error: 'File must be an XML file (WordPress WXR export).' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size must be under ${MAX_FILE_SIZE / 1024 / 1024}MB.` },
        { status: 400 }
      )
    }

    const xmlContent = await file.text()
    if (!xmlContent.includes('<?xml') || !xmlContent.includes('wp:post_type')) {
      return NextResponse.json(
        { error: 'File does not look like a WordPress WXR export. Expected XML with WordPress post data.' },
        { status: 400 }
      )
    }

    const result = importWordPressXml(xmlContent)

    return NextResponse.json({
      success: true,
      inserted: result.inserted,
      skipped: result.skipped,
      categoriesAdded: result.categoriesAdded,
      totalItems: result.totalItems,
    })
  } catch (err) {
    console.error('WordPress import error:', err)
    const message = err instanceof Error ? err.message : 'Import failed'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
