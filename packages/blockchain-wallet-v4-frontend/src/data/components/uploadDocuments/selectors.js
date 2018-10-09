import { path } from 'ramda'

export const getData = path(['components', 'uploadDocument', 'data'])

export const getReference = path(['components', 'uploadDocument', 'reference'])

export const getUploaded = path(['components', 'uploadDocument', 'uploaded'])
