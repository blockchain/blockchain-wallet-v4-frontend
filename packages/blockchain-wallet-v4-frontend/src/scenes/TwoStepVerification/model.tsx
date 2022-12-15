import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconCloseCircle, PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, Icon, Link, SpinningLoader, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { ProductAuthOptions, RecoverSteps } from 'data/types'
import { media } from 'services/styles'

export const SETUP_TWO_FACTOR = 'setupTwoFactor'

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
  padding: 24px;
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

export const TryAnotherMethodRow = styled.div`
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
export enum TwoFactorSetupSteps {
  AUTHENTICATOR_SETUP = 'AUTHENTICATOR_SETUP',
  CHOOSE_TWOFA = 'CHOOSE_TWOFA',
  SMS_SETUP = 'SMS_SETUP',
  TWO_FA_CONFIRMATION = 'TWO_FA_CONFIRMATION',
  YUBIKEY_SETUP = 'YUBIKEY_SETUP'
}
export const ReverifyIdentityInfoBox = () => {
  return (
    <RectangleBackground>
      <Text size='12px' weight={500} lineHeight='1.5' color='grey900'>
        <FormattedMessage
          id='scenes.recovery.reverify_warning'
          defaultMessage='For your security, you may be to re-verify your identity before accessing your Wallet or Exchange funds.'
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
  email?: string
  guid?: string
  handleBackArrowClick: () => void
  product?: ProductAuthOptions
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
          {props.step !== RecoverSteps.RESET_ACCOUNT ||
            (props.product === ProductAuthOptions.EXCHANGE && (
              <Text size='12px' weight={500} color='grey400'>
                ({firstPartGuid}...{lastPartGuid})
              </Text>
            ))}
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

const ClickablePanelWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.grey100};
  border-radius: 0.5rem;
  padding: 1.5rem 1.125rem;
  margin: 1.5rem 0 0;
  cursor: pointer;
  position: relative;
  align-items: center;
`
export const ButtonPanel = ({ children, ...rest }) => {
  return <ClickablePanelWrapper {...rest}>{children}</ClickablePanelWrapper>
}

export const CenteredColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
export const Error = () => {
  return (
    <FormWrapper>
      <CenteredColumn>
        <>
          <IconCloseCircle color={PaletteColors['red-600']} label='error' size='large' />
          <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
            <FormattedMessage
              id='scenes.verifyemailtoken.error'
              defaultMessage='Something went wrong.'
            />
          </Text>
          <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
            <FormattedMessage
              id='scenes.recover.error.tryagain'
              defaultMessage='Try recovering again or contact support.'
            />
          </Text>
        </>
        <Link target='_blank' href='https://support.blockchain.com/'>
          <Button
            nature='primary'
            fullwidth
            style={{ marginTop: '16px' }}
            height='50px'
            data-e2e=''
          >
            <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
          </Button>
        </Link>
      </CenteredColumn>
    </FormWrapper>
  )
}
