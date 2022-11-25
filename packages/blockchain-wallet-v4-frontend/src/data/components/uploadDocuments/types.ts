import { FileUploadItem, RemoteDataType } from '@core/types'

export type DataObject = {
  documentsTypes: Array<string>
  firstName: string
  lastName: string
}

export type UploadDocumentsType = {
  data: DataObject | null
  reference: any
  uploaded: RemoteDataType<string, Array<string>>
}

export type UploadPayload = { files: FileUploadItem[]; redirectUrl: string | null; token: string }
