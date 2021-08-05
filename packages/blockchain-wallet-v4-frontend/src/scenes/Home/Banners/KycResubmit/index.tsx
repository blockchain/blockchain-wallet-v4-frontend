import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.grey000};
  border-radius: 4px;
  overflow: hidden;
  padding: 20px;

  ${media.atLeastLaptop`
    height: 80px;
    padding: 0 20px;
    align-items: flex-start;
  `}
`

const Column = styled.div<{ hiddenOnMobile?: boolean }>`
  display: ${(props) => (props.hiddenOnMobile ? 'none' : 'flex')};
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;

  & > :not(:first-child) {
    margin-top: 4px;
    margin-right: 15px;
  }
`
const Title = styled(Text)`
  color: ${(props) => props.theme.grey900};
  margin-bottom: 4px;
`

const ResubmitBtn = styled(Button).attrs({
  height: '40px',
  nature: 'primary',
  width: '150px'
})`
  font-weight: 500;
`

const KycResubmit = ({ verifyIdentity }) => (
  <Wrapper>
    <Column>
      <Title size='20px' weight={600}>
        <FormattedMessage
          id='scenes.home.banners.kycresubmit.title'
          defaultMessage='Documents Needed'
        />
      </Title>
      <Text size='14px' weight={500} color='grey900'>
        <FormattedMessage
          id='scenes.home.banners.kycresubmit.copy'
          defaultMessage='Please re-verify your identity to access our full products and services.'
        />
      </Text>
    </Column>
    <Column>
      <ResubmitBtn data-e2e='resubmitKycButton' onClick={verifyIdentity}>
        <FormattedMessage
          id='scenes.home.banners.kycresubmit.resubmit'
          defaultMessage='Resubmit Now'
        />
      </ResubmitBtn>
    </Column>
  </Wrapper>
)

const mapDispatchToProps = (dispatch) => ({
  verifyIdentity: () =>
    dispatch(
      actions.components.identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'Resubmission',
        tier: 2
      })
    )
})

export default connect(null, mapDispatchToProps)(KycResubmit)
