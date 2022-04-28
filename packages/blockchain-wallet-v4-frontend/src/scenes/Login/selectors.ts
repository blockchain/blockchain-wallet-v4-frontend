import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { RootState } from 'data/rootReducer'
import { LoginFormType } from 'data/types'

export const getData = (state: RootState) => {
  const accountUnificationFlow = selectors.auth.getAccountUnificationFlowType(state)
  const authType = selectors.auth.getAuthType(state)
  const formValues = selectors.form.getFormValues(LOGIN_FORM)(state) as LoginFormType
  const exchangeLoginR = selectors.auth.getExchangeLogin(state)
  const jwtToken = selectors.auth.getJwtToken(state)
  const language = selectors.preferences.getLanguage(state)
  const magicLinkData = selectors.auth.getMagicLinkData(state)
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
      magicLinkData,
      productAuthMetadata,
      walletLogin
    })
  )(exchangeLoginR, walletLoginR)
}
