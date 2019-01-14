import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { actions, model, selectors } from 'data'
import { Button, Text } from 'blockchain-info-components'
import { Container, Row } from 'components/WhatsNew'
import { equals } from 'ramda'
import media from 'services/ResponsiveService'
const { NONE } = model.profile.KYC_STATES

const DarkText = styled(Text).attrs({
  color: 'gray-5',
  size: '16px',
  weight: 300
})`
  display: inline;
  ${media.laptop`
    display: ${props => (props.hideOnMobile ? 'none' : 'inline')};
  `};
`
const PrimaryText = styled(Text).attrs({
  color: 'brand-primary',
  size: '16px'
})`
  display: inline;
  white-space: nowrap;
`
const GetStartedButton = styled(Button).attrs({
  nature: 'primary',
  fullwidth: true
})`
  font-weight: 500;
  ${media.laptop`
    width: 100%;
  `};
`

export const ExchangeByBlockchain = ({ kycNotFinished, verifyIdentity }) => (
  <Container>
    <Row marginBottom='10px'>
      <Text color='brand-primary' size='24px' weight={600}>
        <FormattedMessage
          defaultMessage="Trading your crypto doesn't mean trading away control."
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.trading_your_crypto'
        />
      </Text>
    </Row>
    <Row marginBottom='24px'>
      <DarkText size='14px'>
        <FormattedMessage
          defaultMessage='November 2018'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.november2018'
        />
      </DarkText>
    </Row>
    <Row marginBottom='24px'>
      <DarkText>
        <FormattedMessage
          defaultMessage='Swap enables you to trade crypto with the best prices and quick settlement, all while maintaining full control of your funds.'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.swap_enables_trade'
        />
      </DarkText>
    </Row>
    <Row marginBottom='8px'>
      <DarkText>
        <PrimaryText>
          <FormattedMessage
            defaultMessage='Low fees'
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.low_fees'
          />
        </PrimaryText>
        <DarkText hideOnMobile>{' - '}</DarkText>
        <FormattedMessage
          defaultMessage='Great news! Get the best prices without having to leave the security of your Wallet.'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.best_prices'
        />
      </DarkText>
    </Row>
    <Row marginBottom='8px'>
      <DarkText>
        <PrimaryText>
          <FormattedMessage
            defaultMessage='Higher Limits'
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.higher_limits'
          />
        </PrimaryText>
        <DarkText hideOnMobile>{' - '}</DarkText>
        <FormattedMessage
          defaultMessage='Like to trade big? Get access to limits of up to $25,000 per day.'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.trade_big'
        />
      </DarkText>
    </Row>
    <Row marginBottom='32px'>
      <DarkText>
        <PrimaryText>
          <FormattedMessage
            defaultMessage='Easy to use'
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.easy_to_use'
          />
        </PrimaryText>
        <DarkText hideOnMobile>{' - '}</DarkText>
        <FormattedMessage
          defaultMessage='Get started in just a few steps.'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.get_started'
        />
      </DarkText>
    </Row>
    <Row>
      {kycNotFinished && (
        <GetStartedButton onClick={verifyIdentity}>
          <FormattedMessage
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.started'
            defaultMessage='Get Started'
          />
        </GetStartedButton>
      )}
      {!kycNotFinished && (
        <LinkContainer to='/swap'>
          <GetStartedButton>
            <FormattedMessage
              id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.makeswap'
              defaultMessage='Make Swap'
            />
          </GetStartedButton>
        </LinkContainer>
      )}
    </Row>
  </Container>
)

const mapStateToProps = state => ({
  kycNotFinished: selectors.modules.profile
    .getUserKYCState(state)
    .map(equals(NONE))
    .getOrElse(false)
})

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(
      actions.components.identityVerification.verifyIdentity(
        model.profile.TIERS[2]
      )
    )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeByBlockchain)
