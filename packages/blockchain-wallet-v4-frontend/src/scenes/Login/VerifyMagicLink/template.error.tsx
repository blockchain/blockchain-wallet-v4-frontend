import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

const ErrorWrapper = styled(Wrapper)`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Error = (props) => {
  const { error } = props
  return (
    <ErrorWrapper>
      <Icon color='error' name='close-circle' size='40px' />
      <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
        {error?.request_denied ? (
          <FormattedMessage
            id='scenes.login.device_verification_rejected'
            defaultMessage='Device verification rejected.'
          />
        ) : error?.link_expired ? (
          <FormattedMessage
            id='scenes.login.device_verification_expired'
            defaultMessage='Verification link expired.'
          />
        ) : (
          <FormattedMessage id='copy.oops' defaultMessage='Oops. Something went wrong.' />
        )}
      </Text>
      <Text style={{ margin: '8px 0 12px' }} size='16px' color='red600' weight={500}>
        {error?.request_denied ? (
          <FormattedMessage
            id='scenes.authorizelogin.loading.rejected.content'
            defaultMessage='Please contact our support team if you have any questions or concerns.'
          />
        ) : error?.link_expired ? (
          <FormattedMessage
            id='scenes.login._device_verification_expired.copy'
            defaultMessage='The device approval link has expired, please try again.'
          />
        ) : (
          <FormattedMessage
            id='scenes.authorizelogin.error.msg'
            defaultMessage='Error: {error}'
            values={{ error }}
          />
        )}
      </Text>
    </ErrorWrapper>
  )
}

export default Error
