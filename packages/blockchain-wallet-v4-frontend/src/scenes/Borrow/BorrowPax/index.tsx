import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Icon, Link, SkeletonRectangle, Text } from 'blockchain-info-components'
import { CustomBox } from 'components/Layout'

import { Props, State } from '..'

class BorrowPax extends PureComponent<Props & State> {
  render() {
    return (
      <CustomBox>
        <div>
          <Icon name='PAX' color='PAX' size='32px' />
          <Text size='20px' color='grey800' weight={600} style={{ marginTop: '16px' }}>
            <FormattedMessage
              id='scenes.borrow.borrowusdd'
              defaultMessage='Borrow USD Digital Today'
            />
          </Text>
          <Text
            size='14px'
            color='grey600'
            weight={500}
            style={{ lineHeight: 1.5, marginTop: '4px' }}
          >
            <FormattedMessage
              id='scenes.borrow.getusddigital'
              defaultMessage='Get USD Digital directly from your Blockchain Wallet, use your bitcoin as collateral. You need to be Gold level to benefit from this new offering.'
            />
          </Text>
        </div>
        {this.props.isDisabled ? (
          this.props.userDataR.cata({
            Failure: () => (
              <Link
                style={{ width: '100%' }}
                target='_blank'
                href='https://support.blockchain.com/'
              >
                <Button fullwidth nature='primary' data-e2e='contactSupport'>
                  <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
                </Button>
              </Link>
            ),
            Loading: () => <SkeletonRectangle width='100%' height='40px' />,
            NotAsked: () => <SkeletonRectangle width='100%' height='40px' />,
            Success: (val) => (
              <Button
                nature='primary'
                data-e2e='verifyIdentityBorrow'
                disabled={val.kycState !== 'NONE'}
                onClick={() => this.props.identityVerificationActions.verifyIdentity(2, false)}
              >
                {val.kycState === 'UNDER_REVIEW' || val.kycState === 'PENDING' ? (
                  <FormattedMessage
                    id='scenes.borrow.kycunderreview'
                    defaultMessage='Gold Verification In Review'
                  />
                ) : (
                  <FormattedMessage id='scenes.borrow.verifyid' defaultMessage='Upgrade Now' />
                )}
              </Button>
            )
          })
        ) : (
          <Link
            style={{ width: '100%' }}
            target='_blank'
            href='https://support.blockchain.com/hc/en-us/articles/360040444691'
          >
            <Button style={{ marginTop: '16px' }} nature='light' fullwidth data-e2e='paxLearnMore'>
              <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
            </Button>
          </Link>
        )}
      </CustomBox>
    )
  }
}

export default BorrowPax
