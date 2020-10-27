import { Props as BaseProps, SuccessStateType } from '../../index'
import { Border, FlexStartRow, IconBackground, TopText } from '../../components'
import { Button, Icon, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import React, { PureComponent } from 'react'

import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'

import { actions, selectors } from 'data'
import { FlyoutWrapper } from 'components/Flyout'
import { InitSwapFormValuesType } from 'data/components/swap/types'

class VerifyIdenity extends PureComponent<Props> {
  state = {}

  render () {
    return (
      <>
        <FlyoutWrapper>
          <TopText spaceBetween marginBottom>
            <Icon name='arrow-switch-thick' color='blue600' size='24px' />
            <Icon
              name='close'
              color='grey600'
              role='button'
              cursor
              onClick={this.props.handleClose}
            />
          </TopText>
          <Text size='24px' color='grey900' weight={600}>
            <FormattedMessage
              id='copy.swap_your_crypto'
              defaultMessage='Swap Your Crypto'
            />
          </Text>
          <Text
            size='16px'
            color='grey600'
            weight={500}
            style={{ marginTop: '10px' }}
          >
            <FormattedMessage
              id='copy.instantly_exchange'
              defaultMessage='Instantly exchange your crypto into any currency we offer in your wallet.'
            />
          </Text>
        </FlyoutWrapper>
        <Border />
        <FlyoutWrapper>
          <Text
            size='20px'
            color='grey800'
            weight={600}
            style={{ marginBottom: '8px' }}
          >
            <FormattedMessage
              id='copy.swap_verify_email'
              defaultMessage='Verify Your Email & Swap Today.'
            />
          </Text>
          <Text
            size='14px'
            color='grey600'
            weight={500}
            style={{ marginBottom: '30px' }}
          >
            <FormattedMessage
              id='copy.swap_get_access'
              defaultMessage='Get access to swap in seconds by completing your profile and getting Silver access.'
            />
          </Text>
          <FlexStartRow style={{ marginBottom: '28px' }}>
            <IconBackground size='32px' style={{ marginRight: '16px' }}>
              <Text color='blue600' size='20px' weight={600}>
                1
              </Text>
            </IconBackground>
            <div>
              <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
                <FormattedMessage
                  id='scenes.verifyemail.title'
                  defaultMessage='Verify Your Email'
                />
              </Text>
              <Text size='12px' lineHeight='150%' weight={500}>
                <FormattedMessage
                  id='copy.swap_confirm'
                  defaultMessage='Confirm your email address to protect your Blockchain.com Wallet.'
                />
              </Text>
            </div>
          </FlexStartRow>
          <FlexStartRow style={{ marginBottom: '28px' }}>
            <IconBackground size='32px' style={{ marginRight: '16px' }}>
              <Text color='blue600' size='20px' weight={600}>
                2
              </Text>
            </IconBackground>
            <div>
              <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
                <FormattedMessage
                  id='copy.swap_add_name'
                  defaultMessage='Add Your Name and Address'
                />
              </Text>
              <Text size='12px' lineHeight='150%' weight={500}>
                <FormattedMessage
                  id='copy.swap_name_address'
                  defaultMessage='We need to know your name and address to comply with local laws.'
                />
              </Text>
            </div>
          </FlexStartRow>
          <FlexStartRow style={{ marginBottom: '62px' }}>
            <IconBackground size='32px' style={{ marginRight: '16px' }}>
              <Text color='blue600' size='20px' weight={600}>
                3
              </Text>
            </IconBackground>
            <div>
              <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
                <FormattedMessage
                  id='copy.swap_start'
                  defaultMessage='Start Swapping'
                />
              </Text>
              <Text size='12px' lineHeight='150%' weight={500}>
                <FormattedMessage
                  id='copy.swap_instantly_exchange'
                  defaultMessage='Instantly exchange your crypto.'
                />
              </Text>
            </div>
          </FlexStartRow>
          <Button
            nature='primary'
            data-e2e='swapVerify'
            height='48px'
            onClick={() =>
              this.props.idvActions.verifyIdentity(2, false, 'Swap')
            }
            fullwidth
          >
            <FormattedMessage
              id='buttons.verify_now'
              defaultMessage='Verify Now'
            />
          </Button>
        </FlyoutWrapper>
      </>
    )
  }
}

const mapStateToProps = state => ({
  values: selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  idvActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  )
})
const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(connector)

type OwnProps = BaseProps & SuccessStateType & { handleClose: () => void }

export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(VerifyIdenity)
