export enum InterestUploadDocumentsStepType {
  'INIT_PAGE'
}

export type InterestUploadDocumentsState = {
  step: InterestUploadDocumentsStepType
}

export type InterestUploadDocumentsPayload = {
  step: InterestUploadDocumentsStepType
}
