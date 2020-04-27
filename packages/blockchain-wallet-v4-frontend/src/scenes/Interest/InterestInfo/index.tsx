import { Box } from 'components/Box'
import {
  Button,
  Icon,
  Link,
  SkeletonRectangle,
  Text
} from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { Props } from '..'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const IconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

class EarnInterestInfo extends PureComponent<Props> {
  render () {
    return (
      <Box>
        {this.props.isDisabled ? (
          this.props.userDataR.cata({
            Success: val => (
              <ContentWrapper>
                <Icon name='savings-icon' color='blue600' size='32px' />
                <Text
                  size='20px'
                  color='grey800'
                  weight={600}
                  style={{ marginTop: '16px' }}
                >
                  <FormattedMessage
                    id='scenes.earninterest.earnupgrade.header'
                    defaultMessage='Put your crypto to work by upgrading to Gold Level.'
                  />
                </Text>
                <Text
                  size='14px'
                  color='grey600'
                  weight={500}
                  style={{ marginTop: '10px', lineHeight: 1.5 }}
                >
                  <FormattedMessage
                    id='scenes.earninterest.earnbody.access'
                    defaultMessage='Upgrade to Gold Level and access benefits like earning up to 3% APY on your crypto.'
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
            <IconWrapper>
              <Icon name='savings-icon' color='blue600' size='32px' />
              <Icon
                cursor
                name='close'
                size='16px'
                color='grey400'
                role='button'
                // onClick={() => props.handleClose()}
              />
            </IconWrapper>
            <Text
              size='20px'
              color='grey800'
              weight={600}
              style={{ marginTop: '16px' }}
            >
              <FormattedMessage
                id='scenes.earninterest.earnheaderverified'
                defaultMessage='Earn interest on your Crypto today.'
              />
            </Text>
            <Text
              size='14px'
              color='grey600'
              weight={500}
              style={{ marginTop: '4px', lineHeight: 1.5 }}
            >
              <FormattedMessage
                id='scenes.earninterest.earninfo.verified.body'
                defaultMessage='Earn up to 3% AER instantly when you deposit BTC to your Interest Account.'
              />
            </Text>
            <Link
              style={{ width: '100%' }}
              target='_blank'
              href='https://support.blockchain.com/hc/en-us/sections/360008572552'
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
      </Box>
    )
  }
}

export default EarnInterestInfo
