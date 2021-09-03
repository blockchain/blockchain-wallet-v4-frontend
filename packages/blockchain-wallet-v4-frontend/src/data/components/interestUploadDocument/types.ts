export enum InterestUploadDocumentsStepType {
  'INIT_PAGE',
  'GET_STARTED',
  'UPLOAD_AND_VERIFIED',
  'UPLOADED'
}

export type InterestUploadDocumentsState = {
  step: InterestUploadDocumentsStepType
}

export type InterestUploadDocumentsPayload = {
  step: InterestUploadDocumentsStepType
}

export type InterestUploadDocumentFormValueTypes = {
  jobTitle: string
  ssn?: string
  totalAmount: string
}
