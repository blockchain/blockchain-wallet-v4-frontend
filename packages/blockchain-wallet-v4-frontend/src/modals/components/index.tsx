import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { css } from 'styled-components'

import { Button, Icon, Image, SpinningLoader, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { OBInstitution } from 'data/types'

const BankWrapper = styled(FlyoutWrapper)`
  padding: 37px 0 34px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`
const NavText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-left: 40px;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
  align-items: center;
  padding: 20px;
`
const QrContainer = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px auto 0;
  padding: 15px;
  border: 2px solid ${(p) => p.theme.blue600};
  border-radius: 4px;

  & img {
    width: 150px;
  }
`
const WaitingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.5s ease-out;
  margin-bottom: 15px;

  & > div:first-child {
    margin-right: 10px;
  }

  &.active {
    opacity: 1;
  }
`
const LinkOptionsWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`
const LogoImage = styled.img`
  margin-bottom: 32px;
  max-height: 60px;
`

interface ScanWithPhoneType {
  children: React.ReactChild
  readonly logo?: string
  readonly qrCode?: string
}
const ScanWithPhone = ({ children, logo, qrCode }: ScanWithPhoneType) => {
  return (
    <Section>
      {logo && <LogoImage src={logo} />}
      <Text weight={600} size='20px' color='grey900'>
        {children}
      </Text>
      <Text weight={500} size='14px' color='grey600'>
        <FormattedMessage
          id='modals.brokerage.use_phone_camera'
          defaultMessage='Use your phone’s camera to scan the QR code.'
        />
      </Text>
      <QrContainer>
        {qrCode ? (
          <img alt='Use your phone’s camera to scan the QR code.' src={qrCode} />
        ) : (
          <SpinningLoader width='30px' height='30px' />
        )}
      </QrContainer>
    </Section>
  )
}

const BankWaitIndicator = ({ qrCode }: { readonly qrCode?: string }) => {
  const [waitCount, setWaitCount] = useState(0)

  if (qrCode) {
    setTimeout(() => {
      setWaitCount(waitCount + 1)
    }, 3e4)
  }

  return (
    <WaitingContainer className={qrCode ? 'active' : ''}>
      <SpinningLoader width='10px' height='10px' borderWidth='3px' />
      <Text size='14px' weight={500}>
        {waitCount === 0 && (
          <FormattedMessage
            id='modals.brokerage.waiting_to_hear'
            defaultMessage='Waiting to hear from your bank'
          />
        )}
        {waitCount > 0 && (
          <FormattedMessage
            id='modals.brokerage.this_can_take_a_while'
            defaultMessage='This can take several minutes, hold tight!'
          />
        )}
      </Text>
    </WaitingContainer>
  )
}

const StyledButton = styled(Button)`
  margin: 20px 0 0;
  display: unset;
`
const LinkViaDesktop = ({
  authUrl,
  children,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick = () => {} // noop
}: {
  authUrl?: string
  children: React.ReactChild
  onClick?: () => void
}) => {
  if (!authUrl) return null
  return (
    <Section>
      <Text weight={600} size='20px' color='grey900'>
        {children}
      </Text>
      <StyledButton
        data-e2e='yapilyBankLink'
        nature='empty-blue'
        onClick={() => {
          window.open(authUrl, '_blank')
          onClick() // additional callback from implementing component
        }}
      >
        <FormattedMessage
          id='modals.brokerage.continue_in_browser'
          defaultMessage='Continue in browser'
        />
      </StyledButton>
    </Section>
  )
}

const StyledText = styled(Text)`
  width: 300px;
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  text-align: center;
`

const BROKERAGE_INELIGIBLE = 'BROKERAGE_INELIGIBLE'

const IneligibleErrorMessage = () => (
  <StyledText size='16px' weight={400}>
    <FormattedMessage
      id='modals.brokerage.ineligible_error'
      defaultMessage='You are not eligible to make deposits and withdrawals with this currency.'
    />
  </StyledText>
)

// getting ready, processing, loading
export enum LoadingTextEnum {
  GETTING_READY = 'Getting Ready...',
  LOADING = 'Loading...',
  PROCESSING = 'Processing...'
}
interface Props {
  text: LoadingTextEnum
}
const Loading = ({ text }: Props) => {
  return (
    <Wrapper>
      <SpinningLoader />
      <Text weight={600} color='grey600' style={{ marginTop: '24px' }}>
        {text === LoadingTextEnum.LOADING && (
          <FormattedMessage id='copy.loading' defaultMessage='Loading...' />
        )}
        {text === LoadingTextEnum.GETTING_READY && (
          <FormattedMessage id='loader.message.gettingready' defaultMessage='Getting Ready...' />
        )}
        {text === LoadingTextEnum.PROCESSING && (
          <FormattedMessage id='modals.simplebuy.processing' defaultMessage='Processing…' />
        )}
      </Text>
    </Wrapper>
  )
}

const SpinnerContainer = styled.div`
  transform: translate(47px, 35px);
  border: 5px solid white;
  border-radius: 50%;
  background-color: white;
`
const HeadingText = styled(Text)`
  font-weight: 600;
  font-size: 20px;
  margin-top: 22px;
`
const BodyText = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  margin: 5px 30px;
`
const LoadingUpdating = () => {
  return (
    <Wrapper>
      <SpinnerContainer>
        <SpinningLoader borderWidth='7px' height='32px' width='32px' />
      </SpinnerContainer>
      <Image name='blockchain-logo-circle' width='106px' />
      <HeadingText color='grey900'>
        <FormattedMessage
          defaultMessage='Updating Your Wallet...'
          id='modals.brokerage.updating_your_wallet'
        />
      </HeadingText>
      <BodyText color='grey600'>
        <FormattedMessage
          defaultMessage='This could take up to 30 seconds. Please do not go back or close the app.'
          id='modals.brokerage.this_could_take'
        />
      </BodyText>
    </Wrapper>
  )
}

interface BankIconProps {
  url: string
}

const BankRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 0px solid ${(p) => p.theme.grey000};
  border-bottom-width: 1px;
  padding: 28px 40px;

  & > div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  ${(props) =>
    props.onClick &&
    css`
      cursor: pointer;
      * {
        cursor: pointer;
      }
      &:hover {
        background-color: ${(props) => props.theme.blue000};
      }
    `}
`

const BankIcon = styled.div<BankIconProps>`
  height: 30px;
  width: 30px;
  background: url('${(p) => p.url}') 0 0 no-repeat;
  background-size: 30px;
  background-position: center;
`

const BankSearchWrapper = styled.div`
  position: relative;
`
const BankSearchInput = styled.input`
  border: 1px solid ${(p) => p.theme.grey000};
  font-size: 16px;
  width: 100%;
  border-width: 1px 0;
  padding: 20px 0 20px 40px;

  &:active,
  &:focus {
    outline: none;
  }
`

const BankSearchIcon = () => (
  <Icon
    size='20px'
    color='grey600'
    name='magnifier'
    style={{ position: 'absolute', right: '60px', top: '20px' }}
  />
)

const SimpleBankRow = (props: { institution: OBInstitution; onClick: () => void }) => {
  return (
    <BankRow onClick={props.onClick}>
      <div>
        <BankIcon url={props.institution.media[0].source} />
        <Text color='grey900' style={{ marginLeft: '20px' }} weight={600}>
          {props.institution.name}
        </Text>
      </div>
      <Icon
        cursor
        name='chevron-right'
        size='20px'
        color='grey600'
        role='button'
        style={{ marginRight: '24px' }}
      />
    </BankRow>
  )
}

const ModalNavWithBackArrow = (props) => {
  return (
    <NavText color='grey800' size='20px' weight={600}>
      <Icon
        cursor
        name='arrow-back'
        size='20px'
        color='grey600'
        role='button'
        style={{ marginRight: '24px' }}
        onClick={() => props.handleClose()}
      />
      {props.children}
    </NavText>
  )
}

const ModalNavWithCloseIcon = (props) => {
  return (
    <NavText color='grey800' size='20px' weight={600} style={{ justifyContent: 'space-between' }}>
      {props.children}
      <Icon
        cursor
        name='close'
        size='20px'
        color='grey600'
        role='button'
        style={{ marginRight: '24px' }}
        onClick={() => props.handleClose()}
      />
    </NavText>
  )
}

const HrEl = styled.hr`
  border: none;
  border-top: 1px solid ${(p) => p.theme.grey100};
  text-align: center;
  overflow: visible;
  color: #333;
  height: 5px;
  width: 100%;

  &:after {
    content: 'OR';
    padding: 0 4px;
    position: relative;
    top: -10px;
    background: ${(p) => p.theme.alwaysWhite};
  }
`

const Hr = () => {
  return (
    <div style={{ width: '100%' }}>
      <Text weight={600} size='16px' color='grey900'>
        <HrEl />
      </Text>
    </div>
  )
}
export {
  BankSearchIcon,
  BankSearchInput,
  BankSearchWrapper,
  BankWaitIndicator,
  BankWrapper,
  BROKERAGE_INELIGIBLE,
  Hr,
  IneligibleErrorMessage,
  LinkOptionsWrapper,
  LinkViaDesktop,
  Loading,
  LoadingUpdating,
  ModalNavWithBackArrow,
  ModalNavWithCloseIcon,
  NavText,
  ScanWithPhone,
  Section,
  SimpleBankRow
}
