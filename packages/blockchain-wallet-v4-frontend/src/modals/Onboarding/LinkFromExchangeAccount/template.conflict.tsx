import { Button, Icon, Text } from 'blockchain-info-components'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { MainWrapper } from './styles'
import { Props } from '.'

import React, { PureComponent } from 'react'
import styled from 'styled-components'

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

class Conflict extends PureComponent<
  Props & { close: () => void; error: any },
  State
> {
  constructor (props) {
    super(props)

    const { email, address } = props.error
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
    const { allowSubmit, selectedEmail, considerEmail } = this.state
    this.setState({ selectedAddress: event.target.value })
    if (!allowSubmit && (selectedEmail !== null || !considerEmail)) {
      this.setState({ allowSubmit: true })
    }
  }

  handleEmail = event => {
    const { allowSubmit, selectedAddress, considerAddress } = this.state
    this.setState({ selectedEmail: event.target.value })
    if (!allowSubmit && (selectedAddress !== null || !considerAddress)) {
      this.setState({ allowSubmit: true })
    }
  }
  handleSubmit = () => {
    const { linkId, error } = this.props
    const { selectedAddress, selectedEmail } = this.state
    this.props.actions.linkFromExchangeAccount(
      linkId,
      selectedEmail,
      JSON.parse(error.address[selectedAddress as string])
    )
  }

  printAddress = (address: string, color: 'grey900' | 'grey600') => {
    const addressProcessed = JSON.parse(address)

    return (
      <AddressContainer>
        <Text color={color} weight={500} style={{ textAlign: 'left' }}>
          {addressProcessed.line1}
        </Text>
        <Text color={color} weight={500} style={{ textAlign: 'left' }}>
          {addressProcessed.line2}
        </Text>
        <Text color={color} weight={500} style={{ textAlign: 'left' }}>
          {`${addressProcessed.city}, ${addressProcessed.state}`}
        </Text>
        <Text color={color} weight={500} style={{ textAlign: 'left' }}>
          {addressProcessed.postCode}
        </Text>
      </AddressContainer>
    )
  }

  render () {
    const {
      allowSubmit,
      considerAddress,
      considerEmail,
      selectedAddress,
      selectedEmail
    } = this.state
    const { email, address } = this.props.error

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
                defaultMessage='Your Wallet and Exchange accounts are now linked, but there are some discrepancies between your profiles.'
              />
            </Text>
          </TitleWrapper>
          <TitleWrapper>
            <Text
              color='grey600'
              weight={500}
              style={{ textAlign: 'left', marginTop: '24px' }}
            >
              <FormattedMessage
                id='modals.onboarding.linkfromexchange.conflict_subtitle_caption'
                defaultMessage='Help us resolve by filling out the below form:'
              />
            </Text>
          </TitleWrapper>
        </HeadingContainer>

        {considerAddress && (
          <SectionWrapper>
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
          <SectionWrapper style={{ marginTop: '48px' }}>
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
                  defaultMessage='This email will be used for all Wallet & Exchange communications.'
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
                  defaultMessage={`If you have 2FA enable for your Wallet, nothing changes. You will still use <span className="grey900">{walletEmail}</span> to securely log in.`}
                  values={{ walletEmail: email.wallet }}
                />
              </Text>
            </TitleWrapper>
          </SectionWrapper>
        )}

        <Button
          nature='primary'
          height='56px'
          fullwidth
          onClick={this.handleSubmit}
          data-e2e='submitProfileDetails'
          disabled={!allowSubmit}
          style={{ marginTop: '80px', marginBottom: '40px' }}
        >
          <Text color='white' size='16px' weight={500}>
            <FormattedMessage
              id='modals.prompt.button'
              defaultMessage='Submit'
            />
          </Text>
        </Button>
      </MainWrapper>
    )
  }
}

export default Conflict
