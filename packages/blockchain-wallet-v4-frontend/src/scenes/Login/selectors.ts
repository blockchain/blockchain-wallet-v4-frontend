import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { LoginFormType, LoginSteps } from 'data/types'

import { LOGIN_FORM_NAME } from './model'

export const getData = (state: RootState) => {
  const accountUnificationFlow = selectors.auth.getAccountUnificationFlowType(state)
  const authType = selectors.auth.getAuthType(state)
  const formValues = selectors.form.getFormValues(LOGIN_FORM_NAME)(state) as LoginFormType
  const exchangeLoginR = selectors.auth.getExchangeLogin(state)
  const jwtToken = selectors.auth.getJwtToken(state)
  const language = selectors.preferences.getLanguage(state)
  const productAuthMetadata = selectors.auth.getProductAuthMetadata(state)
  const walletLoginR = selectors.auth.getLogin(state)

  return lift(
    (
      exchangeLogin: ExtractSuccess<typeof exchangeLoginR>,
      walletLogin: ExtractSuccess<typeof walletLoginR>
    ) => ({
      accountUnificationFlow,
      authType,
      exchangeLogin,
      formValues,
      jwtToken,
      language,
      productAuthMetadata,
      walletLogin
    })
  )(exchangeLoginR, walletLoginR)
}
