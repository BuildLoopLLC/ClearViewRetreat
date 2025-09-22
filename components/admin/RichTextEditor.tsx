'use client'

import { useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Write your content here...',
  className = ''
}: RichTextEditorProps) => {
  const quillRef = useRef<any>(null)

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['blockquote', 'code-block'],
        ['clean']
      ],
      handlers: {
        image: () => {
          const input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', 'image/*')
          input.click()

          input.onchange = async () => {
            const file = input.files?.[0]
            if (!file) return

            try {
              const formData = new FormData()
              formData.append('file', file)
              formData.append('type', 'gratitude-image')

              const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
              })

              if (response.ok) {
                const result = await response.json()
                console.log('Upload successful:', result)
                const quill = quillRef.current?.getEditor()
                if (quill) {
                  const range = quill.getSelection()
                  const index = range ? range.index : quill.getLength()
                  
                  console.log('Inserting image at index:', index)
                  
                  // Insert the image as HTML
                  const imageHtml = `<img src="${result.url}" alt="Uploaded image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;">`
                  quill.clipboard.dangerouslyPasteHTML(index, imageHtml)
                  
                  // Move cursor after the image
                  quill.setSelection(index + 1)
                  
                  console.log('Image inserted successfully')
                } else {
                  console.error('Quill editor not found')
                }
              } else {
                const errorData = await response.json()
                console.error('Failed to upload image:', errorData)
                alert(`Failed to upload image: ${errorData.error || 'Unknown error'}`)
              }
            } catch (error) {
              console.error('Error uploading image:', error)
              alert(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
          }
        }
      }
    }
  }), [])

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'code-block'
  ]



  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          height: '400px',
          marginBottom: '50px'
        }}
      />
      <style jsx global>{`
        .rich-text-editor .ql-editor {
          min-height: 350px;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-radius: 8px 8px 0 0;
        }
        
        .rich-text-editor .ql-container {
          border-bottom: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-radius: 0 0 8px 8px;
        }
        
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0;
        }
        
        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #e2e8f0;
          padding-left: 16px;
          margin: 16px 0;
          font-style: italic;
          color: #64748b;
        }
        
        .rich-text-editor .ql-editor pre {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          overflow-x: auto;
        }
        
        .rich-text-editor .ql-editor code {
          background-color: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor