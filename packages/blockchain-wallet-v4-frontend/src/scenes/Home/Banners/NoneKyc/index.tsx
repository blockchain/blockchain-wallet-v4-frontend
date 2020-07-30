import { actions, model } from 'data'
import { Button } from 'blockchain-info-components'
import {
  CartridgeContainer,
  Column,
  ColumnWrapper,
  SubTitle,
  Title,
  Wrapper
} from '../styles'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { SuccessCartridge } from 'components/Cartridge'
import React from 'react'

const { TIERS } = model.profile

const NoneKyc = ({ loadMore, showCartrige }) => (
  <Wrapper>
    <ColumnWrapper>
      <Column hideRow={showCartrige}>
        {showCartrige && (
          <CartridgeContainer>
            <SuccessCartridge>
              <FormattedMessage id='copy.new' defaultMessage='New' />
            </SuccessCartridge>
          </CartridgeContainer>
        )}
        <Title size='16px' weight={600}>
          <FormattedMessage
            id='scenes.home.banners.nonekyc.title'
            defaultMessage='Link a Bank to Buy Crypto'
          />
        </Title>
        <SubTitle size='14px' weight={500}>
          <FormattedMessage
            id='scenes.home.banners.nonekyc.description'
            defaultMessage='Verify your identity to deposit cash into the Wallet and buy crypto.'
          />
        </SubTitle>
      </Column>
    </ColumnWrapper>
    <ColumnWrapper showSpacing>
      <Column>
        <Button
          nature='primary'
          data-e2e='resubmitKycButton'
          onClick={loadMore}
        >
          <FormattedMessage
            id='buttons.learn_more'
            defaultMessage='Learn More'
          />
        </Button>
      </Column>
    </ColumnWrapper>
  </Wrapper>
)

const mapStateToProps = () => ({
  showCartrige: true
})

const mapDispatchToProps = dispatch => ({
  loadMore: () =>
    dispatch(
      actions.components.identityVerification.verifyIdentity(
        TIERS[2],
        true,
        'KycDocResubmitGoal'
      )
    )
})

export default connect(mapStateToProps, mapDispatchToProps)(NoneKyc)
