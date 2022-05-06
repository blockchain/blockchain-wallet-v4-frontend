import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'
import { getBrowserNameAndVersion } from 'services/browser'
import { analyticsTrackingNoStore } from 'services/tracking'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const BlockchainLogoImage = styled(Image)`
  height: 25px;
  width: 200px;
  margin-top: 10vh;
`
const ErrorTitle = styled(Text)`
  color: white;
  font-weight: 400;
  font-size: 36px;
  margin-bottom: 24px;
`
const ErrorSubtitle = styled(Text)`
  color: white;
  font-weight: 400;
  font-size: 16px;
`
const VersionText = styled(ErrorSubtitle)`
  margin-top: 8px;
  font-size: 13px;
`

// we may not have redux store, cant use react-intl
const Error = ({ error }: Props) => (
  <Wrapper>
    {error === 'unsupportedBrowser' ? (
      <>
        <ErrorTitle>Unsupported Browser</ErrorTitle>
        <ErrorSubtitle>
          You are using {getBrowserNameAndVersion()}, a web browser that we do not support.
        </ErrorSubtitle>
        <ErrorSubtitle style={{ marginTop: '4px' }}>
          Please update to the latest version of Chrome, Firefox, Safari or Opera.
        </ErrorSubtitle>
      </>
    ) : (
      <>
        <ErrorTitle>Application Error</ErrorTitle>
        <ErrorSubtitle style={{ marginTop: '4px' }}>
          We are having trouble retrieving essential data from our servers but rest assured that
          your crypto is safe.
        </ErrorSubtitle>
        <ErrorSubtitle>We are working to resolve and will be back online soon!</ErrorSubtitle>
      </>
    )}
    <BlockchainLogoImage name='blockchain-logo' />
    <VersionText>v{window.APP_VERSION}</VersionText>
  </Wrapper>
)

const AppError: FunctionComponent<Props> = ({ error }) => {
  document.title = 'Blockchain.com Error'
  let queryStringError

  // attempt to get error on hash query string, else use from props
  try {
    // eslint-disable-next-line prefer-destructuring
    queryStringError = window.location.hash.split('#')[1].split('?')[1].split('error=')[1]
  } catch (e) {
    // error was passed in on props
  }

  // only track application load failure in prod
  if (window.location.host === 'login.blockchain.com') {
    analyticsTrackingNoStore({
      events: [
        {
          name: 'Wallet Load Failure',
          originalTimestamp: new Date(),
          properties: {
            error_message: error
          }
        }
      ]
    })
  }

  return <Error error={queryStringError || error} />
}

type Props = {
  error: 'errorAssetsApi' | 'unsupportedBrowser' | 'errorWalletOptionsApi'
}

export default AppError
