import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'
import { actions, model } from 'data'

const { TIERS } = model.profile

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  height: 80px;
  padding: 0 20px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-radius: 4px;
  margin-top: 15px;
  overflow: hidden;
`

const Column = styled.div`
  display: ${props => (props.hiddenOnMobile ? 'none' : 'flex')};
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
  color: ${props => props.theme['marketing-primary']};
  margin-bottom: 4px;
`

const ResubmitBtn = styled(Button).attrs({
  nature: 'primary',
  width: '150px',
  height: '40px'
})`
  font-weight: 500;
`

const KycResubmit = ({ verifyIdentity }) => (
  <Wrapper>
    <Column>
      <Title size='16px' weight={400}>
        <FormattedMessage
          id='scenes.home.banners.kycresubmit.title'
          defaultMessage='Documents Needed'
        />
      </Title>
      <Text size='13px' weight={300}>
        <FormattedMessage
          id='scenes.home.banners.kycresubmit.subtitle'
          defaultMessage="We had some issues with the documents you've supplied.  Please try uploading the documents again to continue with your verification."
        />
      </Text>
    </Column>
    <Column>
      <ResubmitBtn onClick={verifyIdentity}>
        <FormattedMessage
          id='scenes.home.banners.kycresubmit.resubmit'
          defaultMessage='Resubmit Now'
        />
      </ResubmitBtn>
    </Column>
  </Wrapper>
)

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity(TIERS[2]))
})

export default connect(
  null,
  mapDispatchToProps
)(KycResubmit)
