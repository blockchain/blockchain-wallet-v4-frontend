import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, SpinningLoader, Text } from 'blockchain-info-components'

import { BankWrapper, ModalNavWithCloseIcon } from '../../../components'
import { OwnProps as _O, Props as _P, SuccessStateType as _SS } from '.'

type Props = _O & _SS & _P

const Section = styled.div`
  padding: 20px;
  text-align: center;
`

const Hr = styled.hr`
  border: none;
  border-top: 1px solid ${p => p.theme.grey100};
  text-align: center;
  overflow: visible;
  color: #333;
  height: 5px;

  &:after {
    content: 'OR';
    padding: 0 4px;
    position: relative;
    top: -10px;
    background: ${p => p.theme.alwaysWhite};
  }
`

const QrContainer = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px auto 40px;
  padding: 15px;
  border: 2px solid ${p => p.theme.blue600};
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

const StyledButton = styled(Button)`
  margin: 20px 0 0;
  display: unset;
`

const Success = (props: Props) => {
  return (
    <BankWrapper>
      <ModalNavWithCloseIcon {...props}>
        <FormattedMessage
          id='copy.connect_to_your_bank'
          defaultMessage='Connect to your bank'
        />
      </ModalNavWithCloseIcon>
      <Section>
        <img width='32' src={props.account?.attributes.media[0].source} />
        <Text weight={600} size='20px' color='grey900'>
          <FormattedMessage
            id='modals.brokerage.link_via_mobile'
            defaultMessage='Link via mobile'
          />
        </Text>
        <Text weight={500} size='14px' color='grey600'>
          <FormattedMessage
            id='modals.brokerage.use_phone_camera'
            defaultMessage='Use your phone’s camera to scan the QR code.'
          />
        </Text>
        <QrContainer>
          {props.account?.attributes.qrcodeUrl ? (
            <img src={props.account?.attributes.qrcodeUrl} />
          ) : (
            <SpinningLoader width='30px' height='30px' />
          )}
        </QrContainer>

        <WaitingContainer
          className={props.account?.attributes.qrcodeUrl ? 'active' : ''}
        >
          <SpinningLoader width='10px' height='10px' borderWidth='3px' />
          <Text size='14px' weight={500}>
            <FormattedMessage
              id='modals.brokerage.waiting_to_hear'
              defaultMessage='Waiting to hear from your bank'
            />
          </Text>
        </WaitingContainer>
      </Section>
      <Text weight={600} size='16px' color='grey900'>
        <Hr />
      </Text>
      <Section>
        <Text weight={600} size='20px' color='grey900'>
          <FormattedMessage
            id='modals.brokerage.link_via_desktop'
            defaultMessage='Link via desktop'
          />
        </Text>
        <StyledButton
          data-e2e='yapilyBankLink'
          nature='empty-blue'
          onClick={() => {
            window.open(props.account?.attributes.authorisationUrl, '_blank')
          }}
        >
          <FormattedMessage
            id='modals.brokerage.continue_in_browser'
            defaultMessage='Continue in browser'
          />
        </StyledButton>
      </Section>
    </BankWrapper>
  )
}

export default Success
