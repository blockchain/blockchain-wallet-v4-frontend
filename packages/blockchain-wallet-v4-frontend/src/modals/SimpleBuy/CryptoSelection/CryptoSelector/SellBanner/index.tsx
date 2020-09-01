import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Icon, Link, Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const SellContainer = styled.div`
  padding: 40px;
`
const ActionsContainer = styled.div`
  margin-top: 18px;
`

const SellLink = styled(Link)`
  display: flex;
`

class SellBanner extends React.PureComponent<Props> {
  render () {
    return (
      <SellContainer>
        <Text color='grey900' weight={600}>
          <FormattedMessage
            id='modals.simplebuy.selectcrypto.sell_banner_title'
            defaultMessage='Want to sell from your other Wallets?'
          />
        </Text>
        <Text
          color='grey600'
          weight={500}
          size='14px'
          style={{ marginTop: '8px' }}
        >
          <FormattedHTMLMessage
            id='modals.simplebuy.selectcrypto.sell_banner_description'
            defaultMessage='Send crypto from your to your <b>Trading Wallet</b>s. Once that send completes, sell that crypto for cash.'
          />
        </Text>

        <ActionsContainer>
          <SellLink
            size='16px'
            weight={600}
            onClick={() =>
              this.props.modalActions.showModal(`@MODAL.SEND.BTC`, {
                lockboxIndex: null,
                origin: 'FeaturesTopNav'
              })
            }
            data-e2e='sellBannerOpenSendFlow'
          >
            <Text color='blue600' weight={600}>
              <FormattedMessage
                id='components.EmailVerification.sendnow'
                defaultMessage='Send Now'
              />
            </Text>
            <Icon cursor name='arrow-right' size='20px' color='blue600' />
          </SellLink>
        </ActionsContainer>
      </SellContainer>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(SellBanner)
