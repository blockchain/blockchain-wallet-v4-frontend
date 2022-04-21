import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { LoginFormType, LoginSteps, PlatformTypes, ProductAuthOptions } from 'data/auth/types'
import { isMobile } from 'services/styles'

const BackArrowWrapper = styled.div<{ hideBackArrow?: boolean; marginTop?: string }>`
  display: flex;
  justify-content: ${(props) => (props.hideBackArrow ? 'flex-end' : 'space-between')};
  margin-bottom: 24px;
  align-items: center;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 'auto')};
`
const BackArrow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`
const EmailAndGuid = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const BackArrowHeader = (props: {
  formValues: LoginFormType
  handleBackArrowClick: () => void
  hideGuid?: boolean
  marginTop?: string
  platform?: PlatformTypes
  product?: ProductAuthOptions
}) => {
  const isExchangeLogin = props.product === ProductAuthOptions.EXCHANGE
  const email = isExchangeLogin ? props.formValues.exchangeEmail : props.formValues.email
  const guid = props.formValues?.guid
  const firstPartGuid = guid && guid.slice(0, 4)
  const lastPartGuid = guid && guid.slice(-4)
  const hideBackArrow =
    props.platform === PlatformTypes.ANDROID || props.platform === PlatformTypes.IOS
  return (
    <>
      <BackArrowWrapper marginTop={props.marginTop} hideBackArrow={hideBackArrow}>
        {!hideBackArrow && (
          <BackArrow onClick={props.handleBackArrowClick}>
            <Icon
              data-e2e='signupBack'
              name='arrow-back'
              size='24px'
              color='blue600'
              style={{ marginRight: '8px' }}
              role='button'
            />

            <Text color='grey900' size='14px' weight={500} lineHeight='1.5'>
              <FormattedMessage id='copy.back' defaultMessage='Back' />
            </Text>
          </BackArrow>
        )}
        <EmailAndGuid>
          {props.hideGuid || email || (email && isMobile()) || isExchangeLogin ? (
            <Text
              color='blue600'
              size='12px'
              weight={600}
              lineHeight='1.5'
              style={{ marginRight: '2px' }}
            >
              {email}
            </Text>
          ) : (
            <Text color='grey400' size='12px' weight={600} lineHeight='1.5'>
              ({firstPartGuid}...{lastPartGuid})
            </Text>
          )}
          {props.formValues.step !== LoginSteps.CHECK_EMAIL &&
            props.formValues.email &&
            !props.hideGuid &&
            !isMobile() &&
            !isExchangeLogin && (
              <Text size='12px' weight={500} color='grey400'>
                ({firstPartGuid}...{lastPartGuid})
              </Text>
            )}
        </EmailAndGuid>
      </BackArrowWrapper>
    </>
  )
}

export default BackArrowHeader
