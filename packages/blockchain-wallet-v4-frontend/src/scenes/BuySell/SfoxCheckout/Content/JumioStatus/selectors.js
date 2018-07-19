import { path } from 'ramda'

export const getData = state => path(['sfoxSignup', 'jumioStatus'])(state)
