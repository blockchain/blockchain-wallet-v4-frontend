import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Link, SpinningLoader, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { RecoverSteps } from 'data/types'
import { media } from 'services/styles'

export const RECOVER_FORM = 'recover'

export const ActionButton = styled(Button)`
  margin-top: 15px;
`

export const CartridgeSentContainer = styled.div`
  width: auto;
`

export const CircleBackground = styled.div<{ color?: string; size?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.size ? props.size : '48px')};
  height: ${(props) => (props.size ? props.size : '48px')};
  min-width: ${(props) => (props.size ? props.size : '48px')};
  background-color: ${(props) => (props.color ? props.theme[props.color] : props.theme.blue000)};
  border-radius: ${(props) => (props.size ? props.size : '48px')};
  margin: 8px 8px 8px 0;
`

export const placeholder = () => {
  return (
    <FormattedMessage
      id='scenes.recover.firststep.placeholder'
      defaultMessage='Enter your secret private key recovery phrase'
    />
  )
}

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const RectangleBackground = styled.div`
  background-color: ${(props) => props.theme.grey000};
  border-radius: 8px;
  margin-top: 24px;
  padding: 16px;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
`

export const LoaderRow = styled(Row)`
  justify-content: center;
  padding: 108px 0;
`
export const FormWrapper = styled(Wrapper)`
  padding: 24px 32px 32px;
  ${media.mobile`
  padding: 16px;
`}
`

export const OuterWrapper = styled(Wrapper)`
  padding: 24px 0;
  ${media.mobile`
  padding: 16px 0;
`}
`
export const WrapperWithPadding = styled.div`
  padding: 0 32px;
  ${media.mobile`
  padding: 0 16px ;
  `}
`
export const SubCard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  border-top: 1px solid ${(props) => props.theme.grey000};
  padding: 0;
  ${media.mobile`
  flex-direction: column;
  align-items: center;
`};
`

export const TroubleLoggingInRow = styled.div`
  display: flex;
  align-items: center;
  ${media.mobile`
flex-direction: column;
align-items: center;
`}
`
export const ContactSupportText = styled(Link)`
  margin-top: 16px;
  cursor: pointer;
  ${media.mobile`
  margin-top: 0;
`};
  &:hover {
    font-weight: 600;
  }
`
export const ReverifyIdentityInfoBox = () => {
  return (
    <RectangleBackground>
      <Text size='12px' weight={500} lineHeight='1.5' color='grey900'>
        <FormattedMessage
          id='scenes.recovery.reverify'
          defaultMessage='For your security, you may have to re-verify your identity before accessing your trading or rewards account.'
        />
      </Text>
    </RectangleBackground>
  )
}

export const GoBackArrow = (props: { handleBackArrowClick: () => void }) => {
  return (
    <Row style={{ marginBottom: '16px' }} onClick={() => props.handleBackArrowClick()}>
      <Icon
        cursor
        data-e2e='recoverBack'
        name='arrow-back'
        size='24px'
        color='blue600'
        role='button'
        style={{ marginRight: '4px' }}
      />
      <Text size='14px' weight={500} color='grey900' cursor='pointer'>
        <FormattedMessage id='buttons.back' defaultMessage='Back' />
      </Text>
    </Row>
  )
}
const BackArrowWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  align-items: center;
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

export const BackArrowFormHeader = (props: {
  email: string
  guid?: string
  handleBackArrowClick: () => void
  step?: RecoverSteps
}) => {
  const firstPartGuid = props.guid && props.guid.slice(0, 4)
  const lastPartGuid = props.guid && props.guid.slice(-4)
  return (
    <>
      <BackArrowWrapper>
        <BackArrow onClick={props.handleBackArrowClick}>
          <Icon
            cursor
            data-e2e='recoverBack'
            name='arrow-back'
            size='24px'
            color='blue600'
            style={{ marginRight: '4px' }}
            role='button'
          />
          <Text color='grey900' size='14px' weight={500} lineHeight='1.5'>
            <FormattedMessage id='copy.back' defaultMessage='Back' />
          </Text>
        </BackArrow>
        <EmailAndGuid>
          <Text
            color='blue600'
            size='12px'
            weight={600}
            lineHeight='1.5'
            style={{ marginRight: '2px' }}
          >
            {props.email}
          </Text>
          {props.step !== RecoverSteps.RESET_ACCOUNT && (
            <Text size='12px' weight={500} color='grey400'>
              ({firstPartGuid}...{lastPartGuid})
            </Text>
          )}
        </EmailAndGuid>
      </BackArrowWrapper>
    </>
  )
}

export const SpinningLoaderCentered = () => {
  return (
    <LoaderRow>
      <SpinningLoader width='56px' height='56px' />,
    </LoaderRow>
  )
}
