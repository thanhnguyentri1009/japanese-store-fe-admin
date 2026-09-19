import type { AxiosError } from 'axios'
import { uploadAxios } from '../axios'
import { apiUrls } from '../../commons/constants/apiIUrl'
import type { UploadResult } from '../../types/upload'

export const uploadImageToServer = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('image', file)

  try {
    const res = await uploadAxios.post<UploadResult>(apiUrls.upload.image, formData)
    if (!res.data?.url) throw new Error('Upload failed')
    return res.data.url
  } catch (err) {
    const error = (err as AxiosError<{ message?: string }>)?.response?.data
    const message = typeof error?.message === 'string' ? error.message : 'Upload failed'
    throw new Error(message)
  }
}
