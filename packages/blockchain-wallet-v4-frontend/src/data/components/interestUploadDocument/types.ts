import { EarnEDDDocumentsResponse, RemoteDataType } from '@core/types'

export enum InterestUploadDocumentsStepType {
  'INIT_PAGE',
  'GET_STARTED',
  'UPLOAD_AND_VERIFIED',
  'UPLOADED'
}

export type InterestUploadDocumentsPayload = {
  step: InterestUploadDocumentsStepType
}

export type InterestUploadDocumentsState = {
  earnEDDDocumentLimits: RemoteDataType<string, EarnEDDDocumentsResponse>
} & InterestUploadDocumentsPayload

export type InterestUploadDocumentFormValueTypes = {
  expectedDeposits: string
  occupation: string
  ssn?: string
}
