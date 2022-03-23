import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { media } from 'services/styles'

import { BannerButton, CloseLink, Column, Copy, IconWrapper, Row, Wrapper } from '../styles'
import { getTaxCenterAnnouncement } from './selectors'

const StyledWrapper = styled(Wrapper)`
  ${media.atLeastLaptop`
    height: 80px;
    padding: 0 20px;
    align-items: center;
  `}
`

const LeftBox = styled.div`
  display: flex;
  align-items: center;
`

const TaxCenter = ({ cacheActions }) => {
  const taxCenterAnnouncement = getTaxCenterAnnouncement()

  return (
    <StyledWrapper>
      <Row>
        <IconWrapper>
          <Icon name='bank-filled' color='blue600' size='30px' />
        </IconWrapper>
        <Column>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='scenes.home.banner.buy_tax_center_title'
              defaultMessage='Ready for 2022 Tax Season?'
            />
          </Text>
          <Copy size='16px' color='grey600' weight={500}>
            <FormattedMessage
              id='scenes.home.banner.buy_tax_center_description'
              defaultMessage='Download your transaction history if you need to file for this year’s tax season.'
            />
          </Copy>
        </Column>
      </Row>
      <LeftBox>
        <LinkContainer to='/tax-center'>
          <BannerButton jumbo data-e2e='openSDDFlow' nature='primary'>
            <FormattedMessage id='navbar.tax' defaultMessage='Tax Center' />
          </BannerButton>
        </LinkContainer>
        <CloseLink
          data-e2e='taxCenterCloseButton'
          onClick={() => cacheActions.announcementDismissed(taxCenterAnnouncement)}
        >
          <Icon size='20px' color='grey400' name='close-circle' />
        </CloseLink>
      </LeftBox>
    </StyledWrapper>
  )
}
const mapDispatchToProps = (dispatch) => ({
  cacheActions: bindActionCreators(actions.cache, dispatch)
})

export default connect(undefined, mapDispatchToProps)(TaxCenter)
