import { Box } from 'components/Box'
import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType, StateType, SuccessStateType } from '..'
import { prop } from 'ramda'
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

class IntroCard extends PureComponent<
  LinkDispatchPropsType & SuccessStateType & StateType
> {
  render () {
    const { idvActions, interestRate, isGoldTier, userData } = this.props
    return (
      <Box>
        {isGoldTier ? (
          <ContentWrapper>
            <IconWrapper>
              <Icon name='savings-icon' color='blue600' size='32px' />
              <Icon
                cursor
                name='close'
                size='16px'
                color='grey400'
                role='button'
                // onClick to handle close here
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
                defaultMessage='Earn up to {rate}% AER instantly when you deposit BTC to your Interest Account.'
                values={{ rate: prop('BTC', interestRate) }}
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
        ) : (
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
                defaultMessage='Upgrade to Gold Level and access benefits like earning up to {rate}% APY on your crypto.'
                values={{ rate: prop('BTC', interestRate) }}
              />
            </Text>
            <Button
              nature='primary'
              data-e2e='verifyIdentityBorrow'
              style={{ marginTop: '20px' }}
              disabled={userData.kycState !== 'NONE'}
              onClick={() => idvActions.verifyIdentity(2)}
            >
              {userData.kycState === 'UNDER_REVIEW' ||
              userData.kycState === 'PENDING' ? (
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
        )}
      </Box>
    )
  }
}

export default IntroCard
