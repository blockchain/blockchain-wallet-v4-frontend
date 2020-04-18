import {
  Button,
  Icon,
  Link,
  SkeletonRectangle,
  Text
} from 'blockchain-info-components'
import { CustomBox } from 'components/Layout'
import { FormattedMessage } from 'react-intl'
import { Props, State } from '..'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

class EarnInterestInfo extends PureComponent<Props, State> {
  render () {
    return (
      <CustomBox>
        <div>
          <Icon name='savings-icon' color='blue600' size='32px' />
          <Text
            size='20px'
            color='grey800'
            weight={600}
            style={{ marginTop: '16px' }}
          >
            <FormattedMessage
              id='scenes.earninterest.earnheader'
              defaultMessage='Earn Crypto from Your Blockchain Wallet'
            />
          </Text>
        </div>
        {this.props.isDisabled ? (
          this.props.userDataR.cata({
            Success: val => (
              <ContentWrapper>
                <Text
                  size='14px'
                  color='grey600'
                  weight={500}
                  style={{ marginTop: '10px', lineHeight: 1.5 }}
                >
                  <FormattedMessage
                    id='scenes.earninterest.earnbody.unverified'
                    defaultMessage='Upgrade to Gold Level and be eligible to earn up to 3% on your crypto.'
                  />
                </Text>
                <Button
                  nature='primary'
                  data-e2e='verifyIdentityBorrow'
                  style={{ marginTop: '20px' }}
                  disabled={val.kycState !== 'NONE'}
                  onClick={() =>
                    this.props.identityVerificationActions.verifyIdentity(2)
                  }
                >
                  {val.kycState === 'UNDER_REVIEW' ||
                  val.kycState === 'PENDING' ? (
                    <FormattedMessage
                      id='scenes.earninterst.kycunderreview'
                      defaultMessage='Gold Verification In Review'
                    />
                  ) : (
                    <FormattedMessage
                      id='scenes.earninterest.verifyid'
                      defaultMessage='Upgrade Now'
                    />
                  )}
                </Button>
              </ContentWrapper>
            ),
            Failure: () => (
              <Link
                style={{ width: '100%' }}
                target='_blank'
                href='https://support.blockchain.com/'
              >
                <Button
                  fullwidth
                  nature='primary'
                  data-e2e='contactSupport'
                  style={{ marginTop: '20px' }}
                >
                  <FormattedMessage
                    id='buttons.contact_support'
                    defaultMessage='Contact Support'
                  />
                </Button>
              </Link>
            ),
            Loading: () => <SkeletonRectangle width='100%' height='40px' />,
            NotAsked: () => <SkeletonRectangle width='100%' height='40px' />
          })
        ) : (
          <ContentWrapper>
            <Text
              size='14px'
              color='grey600'
              weight={500}
              style={{ marginTop: '4px', lineHeight: 1.5 }}
            >
              <FormattedMessage
                id='scenes.earninterest.earnbody.verified'
                defaultMessage='Earn up to 3% AER instantly when you deposit bitcoin to your Savings Wallet.'
              />
            </Text>
            <Link
              style={{ width: '100%' }}
              target='_blank'
              href='https://support.blockchain.com/'
            >
              <Button
                style={{ marginTop: '16px' }}
                nature='light'
                fullwidth
                data-e2e='earnInterestLearnMore'
              >
                <FormattedMessage
                  id='buttons.learn_more'
                  defaultMessage='Learn More'
                />
              </Button>
            </Link>
          </ContentWrapper>
        )}
      </CustomBox>
    )
  }
}

export default EarnInterestInfo
