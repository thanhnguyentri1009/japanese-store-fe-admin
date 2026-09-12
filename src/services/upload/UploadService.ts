import type { AxiosError } from 'axios'
import { uploadAxios } from '../axios'
import { apiUrls } from '../../commons/constants/apiIUrl'
import type { UploadResult } from '../../types/upload'

const uploadToEndpoint = async (files: File[], endpoint: string): Promise<UploadResult[]> => {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  try {
    const res = await uploadAxios.post<{ data: UploadResult[] }>(endpoint, formData)
    if (!res.data?.data) throw new Error('Upload failed')
    return res.data.data
  } catch (err) {
    const error = (err as AxiosError<{ message?: string }>)?.response?.data
    const message = typeof error?.message === 'string' ? error.message : 'Upload failed'
    throw new Error(message)
  }
}

export const uploadImageToServer = async (files: File | File[]): Promise<string | string[]> => {
  const fileArray = Array.isArray(files) ? files : [files]
  const results = await uploadToEndpoint(fileArray, apiUrls.upload.image)
  const urls = results.map((item) => item.url)
  return Array.isArray(files) ? urls : urls[0]
}
