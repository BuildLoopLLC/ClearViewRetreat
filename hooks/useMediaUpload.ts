import { useState } from 'react'
import { generatePresignedUploadUrl, generateS3Key, S3_CONFIG } from '../lib/s3'

interface UploadState {
  uploading: boolean
  progress: number
  error: string | null
  success: boolean
}

export function useMediaUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
  })

  const uploadFile = async (
    file: File,
    folder: keyof typeof S3_CONFIG.FOLDERS,
    prefix?: string
  ): Promise<string | null> => {
    try {
      setUploadState({
        uploading: true,
        progress: 0,
        error: null,
        success: false,
      })

      // Generate S3 key
      const s3Key = generateS3Key(S3_CONFIG.FOLDERS[folder], file.name, prefix)
      
      // Get presigned URL
      const presignedUrl = await generatePresignedUploadUrl(s3Key, file.type)
      
      // Upload file using presigned URL
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      // Generate public URL
      const publicUrl = `https://${S3_CONFIG.BUCKET_NAME}.s3.${S3_CONFIG.REGION}.amazonaws.com/${s3Key}`

      setUploadState({
        uploading: false,
        progress: 100,
        error: null,
        success: true,
      })

      return publicUrl
    } catch (error: any) {
      setUploadState({
        uploading: false,
        progress: 0,
        error: error.message,
        success: false,
      })
      return null
    }
  }

  const resetUploadState = () => {
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false,
    })
  }

  return {
    uploadFile,
    uploadState,
    resetUploadState,
  }
}
