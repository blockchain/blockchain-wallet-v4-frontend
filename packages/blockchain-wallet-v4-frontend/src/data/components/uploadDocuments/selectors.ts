import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => state.components.uploadDocuments.data

export const getReference = (state: RootState) => state.components.uploadDocuments.reference

export const getUploaded = (state: RootState) => state.components.uploadDocuments.uploaded
