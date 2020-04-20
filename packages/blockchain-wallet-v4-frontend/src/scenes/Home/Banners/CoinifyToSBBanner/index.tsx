import { bindActionCreators, Dispatch } from 'redux'
import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import media from 'services/ResponsiveService'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${props => props.theme.grey000};
  border-radius: 8px;
  padding: 20px;

  @media (min-width: 1200px) {
    height: 80px;
    padding: 0 20px;
  }
  ${media.mobile`
    flex-direction: column;
  `}
`
const Row = styled.div`
  display: flex;
  align-items: center;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;

  & > div:first-child {
    margin-bottom: 4px;
  }
`
const CartIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  border-radius: 20px;
  margin-right: 20px;
  background-color: ${props => props.theme.blue000};
`
const Copy = styled(Text)`
  display: flex;
  align-items: center;
  ${media.mobile`
    font-size: 12px;
  `}
  ${media.tablet`
    font-size: 14px;
  `}
`
const BannerButton = styled(Button)`
  height: 48px;
  ${media.mobile`
    font-size: 14px;
    margin-top: 8px;
    padding: 10px;
  `}
`

class CoinifyToSBBanner extends PureComponent<Props> {
  state = {}

  render () {
    return (
      <Wrapper>
        <Row>
          <CartIconWrapper>
            <Icon name='cart-filled' color='blue600' size='20px' />
          </CartIconWrapper>
          <Column>
            <Text size='20px' weight={600} color='grey800'>
              <FormattedMessage
                id='scenes.home.banner.coinifyToSB.revamped'
                defaultMessage="We've revamped the Buy Crypto experience"
              />
            </Text>
            <Copy size='16px' color='grey600' weight={500}>
              <FormattedMessage
                id='scenes.home.banner.coinifyToSB.access'
                defaultMessage='Eligible users can buy any crypto supported in the Wallet. To access previous order history,'
              />
              &nbsp;
              <Link
                href='https://support.blockchain.com/hc/en-us/articles/360041633252'
                target='_blank'
              >
                <FormattedMessage
                  id='scenes.home.banner.coinifyToSB.read'
                  defaultMessage='read here.'
                />
              </Link>
            </Copy>
          </Column>
        </Row>
        <BannerButton
          jumbo
          data-e2e='openCoinifyToSB'
          nature='primary'
          onClick={() => this.props.simpleBuyActions.showModal('coinifyToSB')}
        >
          <FormattedMessage
            id='scenes.home.banner.coinifyToSB.checkitout'
            defaultMessage='Check It Out'
          />
        </BannerButton>
      </Wrapper>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(
  undefined,
  mapDispatchToProps
)

type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
type Props = ConnectedProps<typeof connector>

export default connector(CoinifyToSBBanner)
