'use client'

import { useMemo, useRef, useEffect, useState } from 'react'
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
  const [editorReady, setEditorReady] = useState(false)

  // Callback ref to detect when ReactQuill is mounted
  const quillCallbackRef = (node: any) => {
    console.log('quillCallbackRef called with node:', node)
    quillRef.current = node
    if (node) {
      console.log('ReactQuill component mounted, setting editor ready')
      setEditorReady(true)
    } else {
      console.log('ReactQuill component unmounted')
      setEditorReady(false)
    }
  }

  // Function to add controls to a specific image element
  const addImageControlsToElement = (img: HTMLImageElement) => {
    if (img.dataset.controlsAdded) return
    
    console.log('Adding controls to image:', img.src)
    img.dataset.controlsAdded = 'true'
    
    // Restore saved dimensions if they exist
    const savedWidth = img.getAttribute('width')
    const savedHeight = img.getAttribute('height')
    console.log('Checking for saved dimensions:', { savedWidth, savedHeight, imgSrc: img.src })
    
    if (savedWidth && savedHeight) {
      // Force the dimensions using both attributes and styles
      img.setAttribute('width', savedWidth)
      img.setAttribute('height', savedHeight)
      img.style.width = `${savedWidth}px`
      img.style.height = `${savedHeight}px`
      img.style.maxWidth = 'none'
      img.style.height = `${savedHeight}px`
      console.log('Restored saved dimensions:', savedWidth, 'x', savedHeight)
    } else {
      // Also check if dimensions are in the style attribute
      const styleWidth = img.style.width
      const styleHeight = img.style.height
      console.log('Checking style dimensions:', { styleWidth, styleHeight })
      
      if (styleWidth && styleHeight) {
        img.style.maxWidth = 'none'
        console.log('Applied style dimensions:', styleWidth, 'x', styleHeight)
      }
    }
    
    // Make image selectable
    img.style.cursor = 'pointer'
    img.style.border = '2px solid transparent'
    img.style.borderRadius = '4px'
    img.style.transition = 'border-color 0.2s ease'
    
    // Create individual controls container for this specific image
    const controlsContainer = document.createElement('div')
    controlsContainer.className = 'image-resize-controls'
    controlsContainer.style.position = 'fixed'
    controlsContainer.style.background = 'white'
    controlsContainer.style.border = '1px solid #ccc'
    controlsContainer.style.borderRadius = '6px'
    controlsContainer.style.padding = '8px'
    controlsContainer.style.display = 'none'
    controlsContainer.style.zIndex = '9999'
    controlsContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
    controlsContainer.style.fontSize = '12px'
    document.body.appendChild(controlsContainer)
    
    // Add dimension inputs
    const widthInput = document.createElement('input')
    widthInput.type = 'number'
    widthInput.placeholder = 'Width'
    widthInput.style.width = '60px'
    widthInput.style.marginRight = '4px'
    widthInput.style.padding = '4px 6px'
    widthInput.style.border = '1px solid #ddd'
    widthInput.style.borderRadius = '3px'
    widthInput.style.fontSize = '12px'
    
    const heightInput = document.createElement('input')
    heightInput.type = 'number'
    heightInput.placeholder = 'Height'
    heightInput.style.width = '60px'
    heightInput.style.marginRight = '4px'
    heightInput.style.padding = '4px 6px'
    heightInput.style.border = '1px solid #ddd'
    heightInput.style.borderRadius = '3px'
    heightInput.style.fontSize = '12px'
    
    const applyButton = document.createElement('button')
    applyButton.textContent = 'Apply'
    applyButton.style.padding = '4px 8px'
    applyButton.style.background = '#3b82f6'
    applyButton.style.color = 'white'
    applyButton.style.border = 'none'
    applyButton.style.borderRadius = '3px'
    applyButton.style.cursor = 'pointer'
    applyButton.style.fontSize = '12px'
    
    // Aspect ratio lock button
    const lockButton = document.createElement('button')
    lockButton.textContent = '🔒'
    lockButton.style.padding = '4px 6px'
    lockButton.style.background = '#6b7280'
    lockButton.style.color = 'white'
    lockButton.style.border = 'none'
    lockButton.style.borderRadius = '3px'
    lockButton.style.cursor = 'pointer'
    lockButton.style.fontSize = '12px'
    lockButton.style.marginRight = '4px'
    lockButton.title = 'Lock aspect ratio'
    
    let aspectRatioLocked = true
    let originalAspectRatio = img.offsetWidth / img.offsetHeight
    
    // Toggle aspect ratio lock
    const toggleAspectRatio = () => {
      aspectRatioLocked = !aspectRatioLocked
      if (aspectRatioLocked) {
        lockButton.textContent = '🔒'
        lockButton.style.background = '#6b7280'
        lockButton.title = 'Lock aspect ratio'
        // Recalculate aspect ratio based on current dimensions
        originalAspectRatio = img.offsetWidth / img.offsetHeight
      } else {
        lockButton.textContent = '🔓'
        lockButton.style.background = '#ef4444'
        lockButton.title = 'Unlock aspect ratio'
      }
    }
    
    lockButton.addEventListener('click', toggleAspectRatio)
    
    // Update height when width changes (if locked)
    const updateHeightFromWidth = () => {
      if (aspectRatioLocked) {
        const newWidth = parseInt(widthInput.value) || img.offsetWidth
        const newHeight = Math.round(newWidth / originalAspectRatio)
        heightInput.value = newHeight.toString()
      }
    }
    
    // Update width when height changes (if locked)
    const updateWidthFromHeight = () => {
      if (aspectRatioLocked) {
        const newHeight = parseInt(heightInput.value) || img.offsetHeight
        const newWidth = Math.round(newHeight * originalAspectRatio)
        widthInput.value = newWidth.toString()
      }
    }
    
    widthInput.addEventListener('input', updateHeightFromWidth)
    heightInput.addEventListener('input', updateWidthFromHeight)
    
    // Populate controls container
    controlsContainer.appendChild(widthInput)
    controlsContainer.appendChild(heightInput)
    controlsContainer.appendChild(lockButton)
    controlsContainer.appendChild(applyButton)
    
    // Set initial values
    widthInput.value = img.offsetWidth.toString()
    heightInput.value = img.offsetHeight.toString()
    
    // Show controls on hover
    img.addEventListener('mouseenter', (e) => {
      // Hide all other controls first
      document.querySelectorAll('.image-resize-controls').forEach(control => {
        control.style.display = 'none'
      })
      
      img.style.borderColor = '#3b82f6'
      
      // Position controls near the image
      const rect = img.getBoundingClientRect()
      controlsContainer.style.left = `${rect.left}px`
      controlsContainer.style.top = `${rect.top - 50}px`
      controlsContainer.style.display = 'block'
    })
    
    img.addEventListener('mouseleave', () => {
      img.style.borderColor = 'transparent'
      // Don't hide immediately, let user interact with controls
      setTimeout(() => {
        if (!controlsContainer.matches(':hover')) {
          controlsContainer.style.display = 'none'
        }
      }, 100)
    })
    
    // Keep controls visible when hovering over them
    controlsContainer.addEventListener('mouseenter', () => {
      controlsContainer.style.display = 'block'
    })
    
    controlsContainer.addEventListener('mouseleave', () => {
      controlsContainer.style.display = 'none'
    })
    
    // Apply size changes
    const applySize = () => {
      const width = parseInt(widthInput.value) || img.offsetWidth
      const height = parseInt(heightInput.value) || img.offsetHeight
      
      if (width > 0 && height > 0) {
        // Update both style and attributes to ensure Quill captures the changes
        img.style.width = `${width}px`
        img.style.height = `${height}px`
        img.style.maxWidth = 'none'
        
        // Also update the HTML attributes so Quill saves them
        img.setAttribute('width', width.toString())
        img.setAttribute('height', height.toString())
        
        console.log('Image resized to:', width, 'x', height)
        controlsContainer.style.display = 'none'
        
        // Trigger Quill's change detection by updating the content
        const editor = quillRef.current?.getEditor()
        if (editor) {
          // Get the current HTML content
          const html = editor.root.innerHTML
          console.log('Original HTML:', html)
          console.log('Looking for image with src:', img.src)
          
          // Update the image in the HTML with the new dimensions
          const updatedHtml = html.replace(
            /<img([^>]*?)src="([^"]*?)"([^>]*?)>/g,
            (match, before, src, after) => {
              console.log('Found image tag:', { match, before, src, after })
              if (src === img.src) {
                console.log('Matched image, updating...')
                // Remove existing width and height attributes if they exist
                const cleanBefore = before.replace(/\s+(width|height)="[^"]*"/g, '')
                const cleanAfter = after.replace(/\s+(width|height)="[^"]*"/g, '')
                const newImg = `<img${cleanBefore}src="${src}"${cleanAfter} width="${width}" height="${height}">`
                console.log('Updated image HTML:', newImg)
                return newImg
              }
              return match
            }
          )
          
          console.log('Updated HTML:', updatedHtml)
          
          // Update the editor content with the modified HTML
          editor.root.innerHTML = updatedHtml
          
          // Trigger the onChange callback to save the changes
          console.log('Triggering onChange with updated HTML')
          console.log('onChange function:', onChange)
          onChange(updatedHtml)
        }
      }
    }
    
    applyButton.addEventListener('click', applySize)
    
    widthInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applySize()
    })
    
    heightInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applySize()
    })
  }

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
        image: function() {
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
                
                // Get the current Quill instance from the toolbar context
                const quill = this.quill
                if (quill) {
                  const range = quill.getSelection()
                  const index = range ? range.index : quill.getLength()
                  
                  console.log('Inserting image at index:', index)
                  
                  // Insert the image using insertEmbed
                  quill.insertEmbed(index, 'image', result.url)
                  
                  // Move cursor after the image
                  quill.setSelection(index + 1)
                  
                  console.log('Image inserted successfully')
                  
                  // Add controls to the newly inserted image
                  setTimeout(() => {
                    const images = quill.container.querySelectorAll('.ql-editor img')
                    const newImage = images[images.length - 1] // Get the last image (most recently added)
                    if (newImage && !newImage.dataset.controlsAdded) {
                      console.log('Adding controls to newly inserted image')
                      addImageControlsToElement(newImage)
                    }
                  }, 50)
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



  // Fallback: Try to detect editor after component mounts
  useEffect(() => {
    const detectEditor = () => {
      console.log('Checking for editor...')
      console.log('quillRef.current:', quillRef.current)
      
      if (quillRef.current) {
        const editor = quillRef.current.getEditor()
        console.log('getEditor() result:', editor)
        if (editor) {
          console.log('Editor detected via fallback method')
          setEditorReady(true)
          return
        }
      }
      
      // Also try to find the editor directly in the DOM
      const quillEditor = document.querySelector('.ql-editor')
      if (quillEditor) {
        console.log('Found .ql-editor in DOM, setting editor ready')
        setEditorReady(true)
        return
      }
      
      // Retry after a short delay
      setTimeout(detectEditor, 100)
    }
    
    // Start detection after component mounts
    setTimeout(detectEditor, 500)
  }, [])

  // Add image editing functionality
  useEffect(() => {
    if (!editorReady) {
      console.log('Editor not ready yet, waiting...')
      return
    }
    
    console.log('Editor ready, setting up image controls...')
    
    // Wait a bit more for the editor to be fully initialized
    setTimeout(() => {
      const editor = quillRef.current?.getEditor()
      console.log('Final editor check - editor:', editor)
      
      if (!editor) {
        console.log('getEditor() still returned null, trying DOM approach')
        // Try to set up controls even without editor object
        setupImageControls(null)
        return
      }
      
      console.log('Editor found, setting up image controls...')
      setupImageControls(editor)
    }, 200)
  }, [editorReady, value])

  const setupImageControls = (editor: any) => {
    const addImageControls = () => {
      // Try both approaches to find images
      let images: NodeListOf<Element>
      if (editor && editor.container) {
        images = editor.container.querySelectorAll('.ql-editor img')
        console.log('Found images via editor.container:', images.length)
      } else {
        images = document.querySelectorAll('.ql-editor img')
        console.log('Found images via document.querySelector:', images.length)
      }
      
      images.forEach((img: any) => {
        // Wait for image to load before applying controls
        if (img.complete) {
          // Add a small delay to ensure the image is fully rendered
          setTimeout(() => {
            addImageControlsToElement(img)
          }, 100)
        } else {
          img.addEventListener('load', () => {
            setTimeout(() => {
              addImageControlsToElement(img)
            }, 100)
          })
        }
      })
    }
    
    // Add controls when content changes
    const observer = new MutationObserver(addImageControls)
    const editorElement = editor?.container?.querySelector('.ql-editor') || document.querySelector('.ql-editor')
    if (editorElement) {
      observer.observe(editorElement, {
        childList: true,
        subtree: true
      })
      
      // Initial setup with delay to ensure editor is ready
      setTimeout(() => {
        console.log('Running initial addImageControls...')
        addImageControls()
      }, 100)
    }
    
    return () => {
      observer.disconnect()
    }
  }

  return (
    <div className={`rich-text-editor ${className}`} style={{ marginBottom: '20px' }}>
      <ReactQuill
        ref={quillCallbackRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          height: '400px',
          marginBottom: '80px'
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
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .rich-text-editor .ql-editor img:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .rich-text-editor .ql-editor img.resizing {
          border: 2px dashed #3b82f6;
          opacity: 0.8;
        }
        
        .image-resize-handle {
          position: absolute;
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          cursor: nw-resize;
          z-index: 1000;
        }
        
        .image-resize-handle:hover {
          background: #2563eb;
          transform: scale(1.2);
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