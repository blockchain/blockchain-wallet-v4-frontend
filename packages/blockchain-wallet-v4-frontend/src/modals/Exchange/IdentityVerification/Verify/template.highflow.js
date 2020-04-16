import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import QRCodeReact from 'qrcode.react'
import React from 'react'
import styled from 'styled-components'

import {
  BackButton,
  Footer,
  IdentityVerificationForm,
  IdentityVerificationHeader,
  IdentityVerificationImage,
  IdentityVerificationSubHeader,
  InputWrapper
} from 'components/IdentityVerification'
import { Button, Link, Text } from 'blockchain-info-components'
import { FooterShadowWrapper } from 'components/Form'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'

const ColumnSubHeader = styled(IdentityVerificationSubHeader)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`
const CenterWrapper = styled.div`
  align-self: center;
`

const QrWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
const QrCode = styled(QRCodeReact)`
  padding: 0 40px;
`

class Verify extends React.PureComponent {
  componentDidMount () {
    this.props.send()
  }

  render () {
    const { onBack, done, deeplink, email } = this.props
    return (
      <IdentityVerificationForm>
        <FooterShadowWrapper
          fields={
            <MediaContextConsumer>
              {({ mobile }) => (
                <InputWrapper>
                  <IdentityVerificationHeader>
                    <FormattedMessage
                      id='identityverification.highflow.header'
                      defaultMessage='Last Step - continue your verification on mobile'
                    />
                  </IdentityVerificationHeader>
                  <IdentityVerificationImage name='identity-verification' />
                  <ColumnSubHeader>
                    <Text weight={400}>
                      <FormattedMessage
                        id='identityverification.highflow.message'
                        defaultMessage='We need you to continue your verification on our mobile app. Follow these steps:'
                      />
                    </Text>
                    <Text size='14px' weight={400}>
                      <FormattedMessage
                        id='identityverification.highflow.sentlink'
                        defaultMessage='*We’ve also sent you an email with these instructions to {email}'
                        values={{ email }}
                      />
                    </Text>
                    <br />
                    {mobile && (
                      <React.Fragment>
                        <CenterWrapper>
                          <Link href={deeplink} target='_blank'>
                            <Button nature='primary'>
                              <FormattedMessage
                                id='identityverification.highflow.continueonmobile'
                                defaultMessage='Continue on mobile'
                              />
                            </Button>
                          </Link>
                        </CenterWrapper>
                        <br />
                        <Text weight={400}>
                          <FormattedHTMLMessage
                            id='identityverification.highflow.followlink'
                            defaultMessage='1 - <b>Follow the link above</b> to log into or download our mobile app.'
                          />
                        </Text>
                        <br />
                        <Text weight={400}>
                          <FormattedHTMLMessage
                            id='identityverification.highflow.gotodashboard'
                            defaultMessage='2 - Continue your verification from the <b>Dashboard</b> (you can also continue from <b>Exchange</b>).'
                          />
                        </Text>
                      </React.Fragment>
                    )}
                    {!mobile && (
                      <QrWrapper>
                        <Text weight={400}>
                          <FormattedHTMLMessage
                            id='identityverification.highflow.scanqr'
                            defaultMessage='1 - <b>Scan this QR code</b> with your phone to log into this wallet or download our mobile app. '
                          />
                          <br />
                          <br />
                          <FormattedHTMLMessage
                            id='identityverification.highflow.gotodashboard'
                            defaultMessage='2 - Continue your verification from the <b>Dashboard</b> (you can also continue from <b>Exchange</b>).'
                          />
                        </Text>
                        <QrCode value={deeplink} size={108} />
                      </QrWrapper>
                    )}
                    <br />
                    <Text weight={400}>
                      <FormattedHTMLMessage
                        id='identityverification.highflow.getidready'
                        defaultMessage='3 - Get your <b>Identity documents</b> (e.g. Passport) and be ready to take a selfie video. '
                      />
                    </Text>
                  </ColumnSubHeader>
                </InputWrapper>
              )}
            </MediaContextConsumer>
          }
          footer={
            <Footer>
              <BackButton data-e2e='highflowBackButton' onClick={onBack}>
                <FormattedMessage id='buttons.back' defaultMessage='Back' />
              </BackButton>
              <Button
                nature='primary'
                data-e2e='highflowDoneButton'
                onClick={done}
              >
                <FormattedMessage
                  id='identityverification.personal.done'
                  defaultMessage="I'm done"
                />
              </Button>
            </Footer>
          }
        />
      </IdentityVerificationForm>
    )
  }
}

Verify.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default Verify
