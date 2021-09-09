import { InterestEDDDocumentsResponse, RemoteDataType } from 'blockchain-wallet-v4/src/types'

export enum InterestUploadDocumentsStepType {
  'INIT_PAGE',
  'GET_STARTED',
  'UPLOAD_AND_VERIFIED',
  'UPLOADED'
}

export type InterestUploadDocumentsState = {
  interestEDDDocumentLimits: RemoteDataType<string, InterestEDDDocumentsResponse>
  step: InterestUploadDocumentsStepType
}

export type InterestUploadDocumentsPayload = {
  step: InterestUploadDocumentsStepType
}

export type InterestUploadDocumentFormValueTypes = {
  expectedDeposits: string
  occupation: string
  ssn?: string
}
