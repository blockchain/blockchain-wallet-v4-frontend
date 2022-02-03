import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Link } from 'blockchain-info-components'
import { ProductAuthOptions } from 'data/auth/types'

const NeedHelpLink = (props: { authActions; origin: string; product: ProductAuthOptions }) => (
  <LinkContainer
    to={props.product === ProductAuthOptions.WALLET ? '/help' : '/help-exchange'}
    onClick={() => props.authActions.analyticsNeedHelpClicked(props.origin)}
  >
    <Link size='13px' weight={600} data-e2e='loginGetHelp'>
      <FormattedMessage id='copy.need_some_help' defaultMessage='Need some help?' />
    </Link>
  </LinkContainer>
)
export default NeedHelpLink
