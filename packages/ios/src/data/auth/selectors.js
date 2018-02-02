// -- EXPOSE AUTHENTICATION SELECTORS -- //
import { path } from 'ramda'

export const wallet = state => path(['auth', 'wallet'], state)
