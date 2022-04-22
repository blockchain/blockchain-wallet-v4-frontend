import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'

import { Link } from 'blockchain-info-components'
import { actions } from 'data'
import { Analytics } from 'data/analytics/types'
import { ProductAuthOptions } from 'data/auth/types'

const NeedHelpLink = ({ analyticsActions, origin, product, unified }: Props) => (
  <LinkContainer
    to={product === ProductAuthOptions.WALLET || unified ? '/recover' : '/help-exchange'}
    onClick={() => {
      analyticsActions.trackEvent({
        key: Analytics.LOGIN_HELP_CLICKED,
        properties: {
          origin,
          site_redirect: product
        }
      })
    }}
  >
    <Link size='13px' weight={600} data-e2e='loginGetHelp'>
      <FormattedMessage id='copy.need_some_help' defaultMessage='Need some help?' />
    </Link>
  </LinkContainer>
)

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type OwnProps = {
  origin: string
  product: ProductAuthOptions
  unified?: boolean
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(NeedHelpLink)
