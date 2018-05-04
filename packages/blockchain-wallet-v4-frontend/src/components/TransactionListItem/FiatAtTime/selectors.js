import { selectors } from 'data'

export const getData = state => selectors.core.settings.getCurrency(state)
