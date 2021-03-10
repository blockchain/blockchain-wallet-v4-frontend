import React, { PureComponent } from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'

import { Props } from '.'
import { ButtonWrapper, MainWrapper } from './styles'

const HeadingContainer = styled.div`
  width: 100%;
  margin-bottom: 36px;
`
const FullWidthWrapper = styled.div`
  width: 100%;
  display: flex;
`
const TitleWrapper = styled.div`
  margin-top: 8px;
  width: 100%;
  display: flex;
`
const SectionWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const RadioInput = styled.input`
  width: 24px;
  height: 24px;
`
const RadioInputLabel = styled.label`
  display: flex;
  flex: 1;
`
const EmailContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  margin: 0 0 16px 16px;
`
const AddressContainer = styled(EmailContainer)`
  flex-direction: column;
`

type State = {
  allowSubmit: boolean
  considerAddress: boolean
  considerEmail: boolean
  selectedAddress: string | null
  selectedEmail: string | null
}

type LinkExchangeErrorType = {
  address: {
    exchange: string
    wallet: string
  }
  email: {
    exchange: string
    wallet: string
  }
}

class Conflict extends PureComponent<
  Props & { close: () => void; error: LinkExchangeErrorType },
  State
> {
  constructor(props) {
    super(props)

    const { address, email } = props.error
    const isEmail =
      email && email.wallet !== 'null' && email.exchange !== 'null'
    const isAddress =
      address && address.wallet !== 'null' && address.exchange !== 'null'

    this.state = {
      allowSubmit: false,
      selectedAddress: null,
      selectedEmail: null,
      considerEmail: isEmail,
      considerAddress: isAddress
    }
  }

  handleAddress = event => {
    const { allowSubmit, considerEmail, selectedEmail } = this.state
    this.setState({ selectedAddress: event.target.value })
    if (!allowSubmit && (selectedEmail !== null || !considerEmail)) {
      this.setState({ allowSubmit: true })
    }
  }

  handleEmail = event => {
    const { allowSubmit, considerAddress, selectedAddress } = this.state
    this.setState({ selectedEmail: event.target.value })
    if (!allowSubmit && (selectedAddress !== null || !considerAddress)) {
      this.setState({ allowSubmit: true })
    }
  }
  handleSubmit = () => {
    const { actions, error, linkId } = this.props
    const { selectedAddress, selectedEmail } = this.state
    let chosenAddress, chosenEmail

    // determine which email to use, if any
    switch (true) {
      case !!selectedEmail:
        chosenEmail = selectedEmail
        break
      case error.email && error.email.wallet !== 'null':
        chosenEmail = error.email.wallet
        break
      case error.email && error.email.exchange !== 'null':
        chosenEmail = error.email.exchange
        break
      default:
        chosenEmail = null
    }

    // determine which address to use, if any
    switch (true) {
      case !!selectedAddress:
        chosenAddress = JSON.parse(
          selectedAddress && error.address[selectedAddress]
        )
        break
      case error.address && error.address.wallet !== 'null':
        chosenAddress = JSON.parse(error.address.wallet)
        break
      case error.address && error.address.exchange !== 'null':
        chosenAddress = JSON.parse(error.address.exchange)
        break
      default:
        chosenAddress = null
    }

    actions.linkFromExchangeAccount(linkId, chosenEmail, chosenAddress)
  }

  printAddress = (address: string, color: 'grey900' | 'grey600') => {
    const addressProcessed = JSON.parse(address)

    return (
      <AddressContainer>
        <Text color={color} weight={500} style={{ textAlign: 'left' }}>
          {addressProcessed.line1}
        </Text>
        {addressProcessed.line2 && addressProcessed.line2 !== 'null' && (
          <Text color={color} weight={500} style={{ textAlign: 'left' }}>
            {addressProcessed.line2}
          </Text>
        )}
        <Text color={color} weight={500} style={{ textAlign: 'left' }}>
          {addressProcessed.city}
          {addressProcessed.state &&
            addressProcessed.state !== 'null' &&
            `, ${addressProcessed.state}`}
        </Text>
        <Text color={color} weight={500} style={{ textAlign: 'left' }}>
          {addressProcessed.postCode}
        </Text>
      </AddressContainer>
    )
  }

  render() {
    const {
      allowSubmit,
      considerAddress,
      considerEmail,
      selectedAddress,
      selectedEmail
    } = this.state
    const { address, email } = this.props.error

    return (
      <MainWrapper>
        <HeadingContainer>
          <FullWidthWrapper>
            <Icon cursor name='user' size='22px' color='blue600' />
          </FullWidthWrapper>
          <TitleWrapper>
            <Text
              color='grey900'
              size='24px'
              weight={600}
              style={{ justifyContent: 'flex-start' }}
            >
              <FormattedMessage
                id='modals.onboarding.linkfromexchange.conflict'
                defaultMessage='Profile Details'
              />
            </Text>
          </TitleWrapper>
          <TitleWrapper>
            <Text color='grey600' weight={500} style={{ textAlign: 'left' }}>
              <FormattedMessage
                id='modals.onboarding.linkfromexchange.conflict_subtitle'
                defaultMessage='Your Wallet and Exchange accounts are now linked! Please select your preferred contact information.'
              />
            </Text>
          </TitleWrapper>
        </HeadingContainer>

        {considerAddress && (
          <SectionWrapper style={{ marginBottom: '24px' }}>
            <TitleWrapper>
              <Text
                color='grey900'
                weight={600}
                style={{ textAlign: 'left', marginBottom: '24px' }}
              >
                <FormattedMessage
                  id='modals.onboarding.linkfromexchange.conflict_address'
                  defaultMessage='Select your most up to date residential address'
                />
              </Text>
            </TitleWrapper>
            <div onChange={this.handleAddress}>
              <FullWidthWrapper>
                <RadioInputLabel>
                  <RadioInput type='radio' value='wallet' name='address' />
                  {this.printAddress(
                    address.wallet,
                    !selectedAddress || selectedAddress === 'wallet'
                      ? 'grey900'
                      : 'grey600'
                  )}
                </RadioInputLabel>
              </FullWidthWrapper>

              <FullWidthWrapper>
                <RadioInputLabel>
                  <RadioInput type='radio' value='exchange' name='address' />
                  {this.printAddress(
                    address.exchange,
                    !selectedAddress || selectedAddress === 'exchange'
                      ? 'grey900'
                      : 'grey600'
                  )}
                </RadioInputLabel>
              </FullWidthWrapper>
            </div>
          </SectionWrapper>
        )}

        {considerEmail && (
          <SectionWrapper style={{ marginBottom: '24px' }}>
            <TitleWrapper>
              <Text color='grey900' weight={500} style={{ textAlign: 'left' }}>
                <FormattedMessage
                  id='modals.onboarding.linkfromexchange.conflict_email'
                  defaultMessage='Select your primary email address'
                />
              </Text>
            </TitleWrapper>
            <TitleWrapper>
              <Text
                color='grey600'
                weight={500}
                size='14px'
                style={{ textAlign: 'left', marginBottom: '24px' }}
              >
                <FormattedMessage
                  id='modals.onboarding.linkfromexchange.conflict_email_description'
                  defaultMessage='This email will be used for all Wallet & Exchange communications only. Your Exchange & Wallet emails will not change.'
                />
              </Text>
            </TitleWrapper>
            <div onChange={this.handleEmail}>
              <FullWidthWrapper>
                <RadioInputLabel>
                  <RadioInput type='radio' value={email.wallet} name='email' />
                  <EmailContainer>
                    <Text
                      color={
                        !selectedEmail || selectedEmail === email.wallet
                          ? 'grey900'
                          : 'grey600'
                      }
                      weight={500}
                      style={{
                        justifyContent: 'flex-start',
                        lineHeight: '32px'
                      }}
                    >
                      {email.wallet}
                    </Text>
                  </EmailContainer>
                </RadioInputLabel>
              </FullWidthWrapper>
              <FullWidthWrapper>
                <RadioInputLabel>
                  <RadioInput
                    type='radio'
                    value={email.exchange}
                    name='email'
                  />
                  <EmailContainer>
                    <Text
                      color={
                        !selectedEmail || selectedEmail === email.exchange
                          ? 'grey900'
                          : 'grey600'
                      }
                      weight={500}
                      style={{
                        justifyContent: 'flex-start',
                        lineHeight: '32px'
                      }}
                    >
                      {email.exchange}
                    </Text>
                  </EmailContainer>
                </RadioInputLabel>
              </FullWidthWrapper>
            </div>

            <TitleWrapper>
              <Text
                color='grey600'
                size='14px'
                weight={500}
                style={{
                  textAlign: 'left',
                  marginTop: '34px'
                }}
              >
                <FormattedHTMLMessage
                  id='modals.onboarding.linkfromexchange.email_disclaimer1'
                  defaultMessage='Keep using <span class="grey900">{exchangeEmail}</span> to log into the Exchange'
                  values={{ exchangeEmail: email.exchange }}
                />
              </Text>
            </TitleWrapper>
            <TitleWrapper>
              <Text
                color='grey600'
                size='14px'
                weight={500}
                style={{
                  textAlign: 'left',
                  marginTop: '16px'
                }}
              >
                <FormattedHTMLMessage
                  id='modals.onboarding.linkfromexchange.email_disclaimer2'
                  defaultMessage={`If you have 2FA enabled for your Wallet, nothing changes. You will still use <span className="grey900">{walletEmail}</span> to securely log in.`}
                  values={{ walletEmail: email.wallet }}
                />
              </Text>
            </TitleWrapper>
          </SectionWrapper>
        )}

        <ButtonWrapper>
          <Button
            nature='primary'
            height='56px'
            fullwidth
            onClick={this.handleSubmit}
            data-e2e='submitProfileDetails'
            disabled={!allowSubmit}
          >
            <Text color='white' size='16px' weight={500}>
              <FormattedMessage
                id='modals.prompt.button'
                defaultMessage='Submit'
              />
            </Text>
          </Button>
        </ButtonWrapper>
      </MainWrapper>
    )
  }
}

export default Conflict
