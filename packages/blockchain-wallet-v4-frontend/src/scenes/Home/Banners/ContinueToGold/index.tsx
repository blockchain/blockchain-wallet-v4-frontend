import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${props => props.theme.grey000};
  border-radius: 8px;
  padding: 20px;

  ${media.atLeastLaptop`
    height: 80px;
    padding: 0 20px;
  `}
  ${media.mobile`
    padding: 12px;
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
const PendingIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
  margin-right: 20px;
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
    margin-top: 16px;
    padding: 10px;
  `}
`

const ContinueToGold = ({ verifyIdentity }: Props) => (
  <Wrapper>
    <Row>
      <PendingIconWrapper>
        <Image name='tier-gold' size='32px' />
      </PendingIconWrapper>
      <Column>
        <Text size='20px' weight={600} color='grey800'>
          <FormattedMessage
            id='scenes.home.banner.continue_to_gold.increase_your_limits'
            defaultMessage='Increase your limits'
          />
        </Text>
        <Copy size='16px' color='grey600' weight={500}>
          <FormattedMessage
            id='scenes.home.banner.continue_to_gold.description'
            defaultMessage='Continue your verification to become Gold level and increase your limits and payment methods'
          />
        </Copy>
      </Column>
    </Row>
    <BannerButton
      onClick={verifyIdentity}
      jumbo
      data-e2e='continueToGoldSDD'
      nature='primary'
    >
      <FormattedMessage
        id='scenes.home.banner.continue_to_gold.button'
        defaultMessage='Continue to Gold'
      />
    </BannerButton>
  </Wrapper>
)

const mapDispatchToProps = (dispatch: Dispatch) => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity(2, false))
})

const connector = connect(undefined, mapDispatchToProps)
type Props = ConnectedProps<typeof connector>

export default connector(ContinueToGold)
