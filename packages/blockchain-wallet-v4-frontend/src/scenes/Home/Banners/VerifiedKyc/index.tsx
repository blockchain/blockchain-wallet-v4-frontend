import { actions, model } from 'data'
import { Button, Icon, Text } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { SuccessCartridge } from 'components/Cartridge'
import React from 'react'
import styled from 'styled-components'

import media from 'services/ResponsiveService'

const { TIERS } = model.profile

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.grey000};

  ${media.atLeastLaptop`
    height: 56px;
    padding: 0 20px;
    align-items: flex-start;
  `}
`

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`
const Column = styled.div<{ hiddenOnMobile?: boolean }>`
  display: ${props => (props.hiddenOnMobile ? 'none' : 'flex')};
  flex-direction: ${props => (props.hiddenOnMobile ? 'none' : 'row')};
  justify-content: center;
  align-items: flex-start;
`
const Title = styled(Text)`
  color: ${props => props.theme.grey800};
  margin-top: 4px;
  margin-right: 8px;
`
const SubTitle = styled(Text)`
  margin-top: 6px;
`

const CartridgeContainer = styled.div`
  width: auto;
  margin-right: 14px;
`

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 40px;
  margin-left: 18px;
  > span {
    cursor: pointer;
  }
`

const VerifiedKyc = ({ learnMore, handleCloseClick }) => (
  <Wrapper>
    <ColumnWrapper>
      <Column>
        <CartridgeContainer>
          <SuccessCartridge>
            <FormattedMessage
              id='scenes.home.banners.verifiedkyc.tag'
              defaultMessage='NEW'
            />
          </SuccessCartridge>
        </CartridgeContainer>
        <Title size='16px' weight={600}>
          <FormattedMessage
            id='scenes.home.banners.verifiedkyc.title'
            defaultMessage='Keep Cash in Your Wallet'
          />
        </Title>
        <SubTitle size='14px' weight={500}>
          <FormattedMessage
            id='scenes.home.banners.verifiedkyc.description'
            defaultMessage='Verify your identity to deposit cash into the Wallet and buy crypto.'
          />
        </SubTitle>
      </Column>
    </ColumnWrapper>
    <ColumnWrapper>
      <Column>
        <Button
          nature='primary'
          data-e2e='resubmitKycButton'
          onClick={learnMore}
        >
          <FormattedMessage
            id='scenes.home.banners.verifiedkyc.button'
            defaultMessage='Learn More'
          />
        </Button>
        <IconWrapper>
          <Icon
            name='close-circle'
            color='grey400'
            size='20px'
            onClick={handleCloseClick}
          />
        </IconWrapper>
      </Column>
    </ColumnWrapper>
  </Wrapper>
)

const mapDispatchToProps = dispatch => ({
  learnMore: () =>
    dispatch(
      actions.components.identityVerification.verifyIdentity(
        TIERS[2],
        true,
        'KycDocResubmitGoal'
      )
    ),
  handleCloseClick: () => dispatch(actions.preferences.hideNoneOrGoldBanner())
})

export default connect(null, mapDispatchToProps)(VerifiedKyc)
