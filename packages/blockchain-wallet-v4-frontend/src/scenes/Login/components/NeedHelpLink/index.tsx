import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'

import { Link } from 'blockchain-info-components'
import { actions } from 'data'
import { Analytics } from 'data/analytics/types'
import { PlatformTypes, ProductAuthOptions } from 'data/types'

const NeedHelpLink = ({ analyticsActions, origin, platform, product, unified }: Props) => (
  <LinkContainer
    to={product === ProductAuthOptions.WALLET || unified ? '/recover' : '/help-exchange'}
    onClick={() => {
      analyticsActions.trackEvent({
        key: Analytics.LOGIN_FORGOT_PASSWORD_CLICKED,
        properties: {
          device_origin: platform,
          origin,
          site_redirect: product,
          unified
        }
      })
    }}
  >
    <Link size='13px' weight={600} data-e2e='loginForgotPassword'>
      <FormattedMessage id='scenes.help.forgotpassword' defaultMessage='Forgot your password?' />
    </Link>
  </LinkContainer>
)

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type OwnProps = {
  origin: string
  platform?: PlatformTypes
  product: ProductAuthOptions
  unified?: boolean
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(NeedHelpLink)
