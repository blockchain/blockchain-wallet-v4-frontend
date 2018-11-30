import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import styled from 'styled-components'
import QRCodeReact from 'qrcode.react'

import media from 'services/ResponsiveService'

import { Button, Link, Text } from 'blockchain-info-components'
import { FooterShadowWrapper } from 'components/Form'
import {
  BackButton,
  ColLeft,
  IdentityVerificationForm,
  InputWrapper,
  IdentityVerificationHeader,
  IdentityVerificationSubHeader,
  IdentityVerificationImage
} from 'components/IdentityVerification'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'

const Footer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const ColumnSubHeader = styled(IdentityVerificationSubHeader)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  ustify-content: flex-start;
`
const VerifyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
  `};
`
const CenterWrapper = styled.div`
  align-self: center;
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
                <VerifyWrapper>
                  <ColLeft>
                    <InputWrapper>
                      <IdentityVerificationHeader>
                        <FormattedMessage
                          id='identityverification.highflow.header'
                          defaultMessage='Last Step - continue your verification on mobile'
                        />
                      </IdentityVerificationHeader>
                      <IdentityVerificationImage name='identity-verification' />
                      <ColumnSubHeader>
                        <Text weight={300}>
                          <FormattedMessage
                            id='identityverification.highflow.message'
                            defaultMessage='We need you to continue your verification on our mobile app. Follow these steps:'
                          />
                        </Text>
                        <Text size='14px' weight={300}>
                          <FormattedMessage
                            id='identityverification.highflow.sentlink'
                            defaultMessage='*We’ve also sent you an email with these instructions to {email}'
                            values={{ email }}
                          />
                        </Text>
                        <br />
                        {mobile && (
                          <React.Fragment>
                            <Text weight={300}>
                              <FormattedHTMLMessage
                                id='identityverification.highflow.followlink'
                                defaultMessage='1 - <b>Follow this link</b> to log into or download our mobile app.'
                              />
                            </Text>
                            <br />
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
                          </React.Fragment>
                        )}
                        {!mobile && (
                          <React.Fragment>
                            <Text weight={300}>
                              <FormattedHTMLMessage
                                id='identityverification.highflow.scanqr'
                                defaultMessage='1 - <b>Scan this QR code</b> with your phone to log into this wallet or download our mobile app. '
                              />
                            </Text>
                            <br />
                            <CenterWrapper>
                              <QRCodeReact value={deeplink} size={108} />
                            </CenterWrapper>
                          </React.Fragment>
                        )}
                        <br />
                        <Text weight={300}>
                          <FormattedHTMLMessage
                            id='identityverification.highflow.gotodashboard'
                            defaultMessage='2 - Continue your verification from the <b>Dashboard</b> (you can also continue from <b>Exchange</b>).'
                          />
                        </Text>
                        <br />
                        <Text weight={300}>
                          <FormattedHTMLMessage
                            id='identityverification.highflow.getidready'
                            defaultMessage='3 - Get your <b>Identity documents</b> (e.g. Passport) and be ready to take a selfie video. '
                          />
                        </Text>
                      </ColumnSubHeader>
                    </InputWrapper>
                  </ColLeft>
                </VerifyWrapper>
              )}
            </MediaContextConsumer>
          }
          footer={
            <Footer>
              <BackButton onClick={onBack}>
                <FormattedMessage
                  id='identityverification.personal.back'
                  defaultMessage='Back'
                />
              </BackButton>
              <Button nature='primary' onClick={done}>
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
