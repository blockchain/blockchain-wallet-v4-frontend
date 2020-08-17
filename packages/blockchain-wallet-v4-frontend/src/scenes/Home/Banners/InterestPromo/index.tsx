import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { actions } from 'data'
import { Button, Icon } from 'blockchain-info-components'
import media from 'services/ResponsiveService'

import {
  CartridgeContainer,
  Column,
  ColumnWrapper,
  SubTitle,
  Title,
  Wrapper
} from '../styles'

const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
`
const StyledWrapper = styled(Wrapper)`
  height: 90px !important;
  ${media.laptopM`
    height: 110px !important;
  `}
  ${media.laptop`
    height: 115px !important;
  `}
  ${media.tablet`
    height: 125px !important;
  `}
`
const IconWrapper = styled(CartridgeContainer)`
  margin-top: 6px;
  ${media.laptopM`
    margin-top: 12px;
  `}
  ${media.laptop`
    margin-top: 16px;
  `}
  ${media.tablet`
    margin-top: 20px;
  `}
`

const InterestPromo = ({ onDeposit }) => (
  <StyledWrapper>
    <ColumnWrapper>
      <Column hideRow>
        <IconWrapper>
          <Icon color='blue600' name='percentage' size='40px' />
        </IconWrapper>
        <TextColumn>
          <Title size='20px' weight={600}>
            <FormattedMessage
              id='scenes.home.banners.interestpromo.title'
              defaultMessage='Limited Time: Earn up to 12% annual interest'
            />
          </Title>
          <SubTitle size='14px' weight={500}>
            <FormattedMessage
              id='scenes.home.banners.interestpromo.subtitle'
              defaultMessage='Deposit crypto in an Interest Account by midnight on Wednesday to supercharge your interest on BTC, ETH, USDT, and PAX.'
            />
          </SubTitle>
        </TextColumn>
      </Column>
    </ColumnWrapper>
    <ColumnWrapper showSpacing>
      <Column>
        <Button
          data-e2e='interestPromoDeposit'
          nature='primary'
          onClick={onDeposit}
        >
          <FormattedMessage
            id='scenes.home.banners.interestpromo.button'
            defaultMessage='Deposit Now'
          />
        </Button>
      </Column>
    </ColumnWrapper>
  </StyledWrapper>
)

const mapDispatchToProps = dispatch => ({
  onDeposit: () => dispatch(actions.router.push(`/interest`))
})

export default connect(null, mapDispatchToProps)(InterestPromo)
