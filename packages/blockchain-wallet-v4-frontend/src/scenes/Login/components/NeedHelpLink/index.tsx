import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'

import { Link } from 'blockchain-info-components'
import { trackEvent } from 'data/analytics/slice'
import { Analytics } from 'data/analytics/types'
import { PlatformTypes, ProductAuthOptions } from 'data/types'

const NeedHelpLink = ({ origin, platform, product, unified }: Props) => {
  const dispatch = useDispatch()

  const onClick = () => {
    dispatch(
      trackEvent({
        key: Analytics.LOGIN_FORGOT_PASSWORD_CLICKED,
        properties: {
          device_origin: platform,
          origin,
          site_redirect: product,
          unified
        }
      })
    )
  }

  const linkTo = product === ProductAuthOptions.WALLET || unified ? '/recover' : '/help-exchange'

  return (
    <LinkContainer to={linkTo} onClick={onClick}>
      <Link size='13px' weight={600} data-e2e='loginForgotPassword'>
        <FormattedMessage id='scenes.help.forgotpassword' defaultMessage='Forgot your password?' />
      </Link>
    </LinkContainer>
  )
}

type Props = {
  origin: string
  platform?: PlatformTypes
  product: ProductAuthOptions
  unified?: boolean
}

export default NeedHelpLink
