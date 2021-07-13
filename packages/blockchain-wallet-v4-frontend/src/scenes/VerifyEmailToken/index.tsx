import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const VALID_CONTEXTS = ['PIT_SIGNUP', 'KYC', 'SETTINGS']
const PARAM_DEEP_LINK_PATH = 'email_verified'
const PARAM_ISI = '493253309'
const PARAM_IBI = 'com.rainydayapps.Blockchain'
const PARAM_APN = 'piuk.blockchain.android'

const VerifyEmailToken = ({ appEnv, data, location, miscActions }: Props) => {
  const token = decodeURIComponent(location.pathname.split('/verify-email/')[1])

  const urlParamContext = new URLSearchParams(location.search).get('context')

  useEffect(() => {
    miscActions.verifyEmailToken(token)
  }, [])

  const getMobileLinkOut = () => {
    const isProdEnv = appEnv === 'prod'

    const link = isProdEnv
      ? 'https://blockchain.page.link/'
      : 'https://blockchainwalletstaging.page.link/'

    const deepLinkParams = new URLSearchParams()

    deepLinkParams.set('deep_link_path', PARAM_DEEP_LINK_PATH)

    if (urlParamContext != null && VALID_CONTEXTS.indexOf(urlParamContext.toUpperCase()) > -1) {
      deepLinkParams.set('context', urlParamContext)
    }

    const deepLink = `${window.location.origin}/login?${deepLinkParams}`

    const params = new URLSearchParams()

    params.set('link', deepLink)
    params.set('isi', PARAM_ISI)
    params.set('ibi', PARAM_IBI)
    params.set('apn', PARAM_APN)

    return `${link}?${params}`
  }

  const mobileLinkOut = getMobileLinkOut()

  return (
    <Wrapper>
      {data.cata({
        Failure: (error) => <Error error={error} />,
        Loading: () => <Loading />,
        NotAsked: () => <Loading />,
        Success: () => <Success mobileLinkOut={mobileLinkOut} />
      })}
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  appEnv: selectors.core.walletOptions.getAppEnv(state).getOrElse('prod'),
  data: selectors.core.data.misc.verifyEmailToken(state)
})

const mapDispatchToProps = (dispatch) => ({
  miscActions: bindActionCreators(actions.core.data.misc, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & {
  location: { pathname: string; search: string }
}

export default connector(VerifyEmailToken)
