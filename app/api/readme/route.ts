import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const readmePath = path.join(process.cwd(), 'README.md')
    const content = fs.readFileSync(readmePath, 'utf-8')
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error reading README:', error)
    return NextResponse.json(
      { error: 'Failed to read README', content: '# README not found\n\nCould not load the README file.' },
      { status: 500 }
    )
  }
}

