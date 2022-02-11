import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { LoginFormType, LoginSteps, ProductAuthOptions } from 'data/auth/types'
import { isMobile } from 'services/styles'

const BackArrowWrapper = styled.div<{ marginTop?: string }>`
  display: flex;
  justify-content: space-between;
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
  hideBackArrow?: boolean
  hideGuid?: boolean
  marginTop?: string
  product?: ProductAuthOptions
}) => {
  const email =
    props.product === ProductAuthOptions.EXCHANGE
      ? props.formValues.exchangeEmail
      : props.formValues.email
  const guid = props.formValues?.guid
  const firstPartGuid = guid && guid.slice(0, 4)
  const lastPartGuid = guid && guid.slice(-4)
  return (
    <>
      <BackArrowWrapper marginTop={props.marginTop}>
        <BackArrow onClick={props.handleBackArrowClick}>
          {!props.hideBackArrow && (
            <Icon
              data-e2e='signupBack'
              name='arrow-back'
              size='24px'
              color='blue600'
              style={{ marginRight: '8px' }}
              role='button'
            />
          )}
          <Text color='grey900' size='14px' weight={500} lineHeight='1.5'>
            <FormattedMessage id='copy.back' defaultMessage='Back' />
          </Text>
        </BackArrow>
        <EmailAndGuid>
          {props.hideGuid || email || (email && isMobile()) ? (
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
            !isMobile() && (
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
