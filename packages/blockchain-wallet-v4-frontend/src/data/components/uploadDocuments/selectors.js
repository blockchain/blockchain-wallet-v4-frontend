import { path } from 'ramda'

export const getData = path(['components', 'uploadDocuments', 'data'])

export const getReference = path(['components', 'uploadDocuments', 'reference'])

export const getUploaded = path(['components', 'uploadDocuments', 'uploaded'])
