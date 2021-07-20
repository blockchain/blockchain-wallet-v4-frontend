import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { all, path, propEq } from 'ramda'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Text, TextGroup } from 'blockchain-info-components'
import { Exchange } from 'blockchain-wallet-v4/src'
import { formatFiat } from 'blockchain-wallet-v4/src/exchange/utils'
import { actions, model } from 'data'
import { media } from 'services/styles'

import { TIERS } from './model'
import { getData } from './selectors'
import { ctas, headers, limits, messages, status } from './services'

const Wrapper = styled.div`
  display: flex;
  border-radius: 8px;
  position: relative;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.grey000};
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.21);
  width: 375px;
  &.column {
    width: 260px;
  }
  &.rejected {
    filter: grayscale(100%);
    box-shadow: none;
    opacity: 0.9;
  }
  &:hover {
    cursor: pointer;
  }
  ${media.laptop`
    width: 100%;
    &.column {
      width: 100%;
    }
  `};
`
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
`
const Header = styled(Text)`
  display: flex;
  text-align: center;
  align-items: center;
  width: 50%;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 2px;
  ${Wrapper}.column & {
    width: 100%;
    justify-content: center;
  }
`
const Row = styled.div`
  display: flex;
  ${Wrapper}.column & {
    flex-direction: column;
  }
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: ${(props: { width?: string }) => props.width || '100%'};
  &:first-child {
    margin-right: 20px;
    border-right: 1px solid ${(props) => props.theme.grey000};
  }
  ${Wrapper}.column & {
    text-align: center;
    &:first-child {
      margin-right: 0px;
      border-right: 0px;
      border-bottom: 1px solid ${(props) => props.theme.grey000};
      padding-bottom: 15px;
      margin-bottom: 15px;
    }
  }
`
const Content = styled.div`
  margin-top: 10px;
`
export const ActionButton = styled(Button)`
  margin-top: 20px;
`

const { TIERS_STATES } = model.profile

export const TierCard = ({
  column,
  emailVerified,
  identityVerificationActions,
  mobileVerified,
  simpleBuyActions,
  swapActions,
  tier,
  userData,
  userTiers
}: Props) => {
  const tierData = userTiers.find((userTier) => userTier.index === tier)
  if (!tierData) return null
  const limitType: 'daily' | 'annual' = TIERS[tier].limit.toLowerCase()
  const tierFiatLimit =
    Exchange.getSymbol(tierData.limits.currency) + formatFiat(tierData.limits[limitType], 0)
  const tierLimit = limits[path([tier, 'limit'], TIERS)]
  const tierStatus = status(tier, userTiers, path([tier, 'time'], TIERS))
  const isRejected = all(propEq('state', TIERS_STATES.REJECTED), userTiers)

  const tierStarted = userData.tiers && userData.tiers.selected >= tier
  const tierLevel = path(['tiers', 'current'], userData)

  let className = ''
  if (column) className += ' column'
  if (isRejected) className += ' rejected'

  return (
    <Wrapper className={className}>
      <Container>
        <Header color='marketing-primary' uppercase>
          {headers[path([tier, 'level'], TIERS)]}
        </Header>
        <Content>
          <Row>
            <Column>
              <Text size='32px' weight={600} color='marketing-secondary'>
                {tierFiatLimit}
              </Text>
              <Text size='14px' weight={500} color='textBlack' style={{ marginTop: '8px' }}>
                {tierLimit}
              </Text>
              <Text size='14px' weight={500} color='grey400' style={{ marginTop: '7px' }}>
                {tierStatus}
              </Text>
            </Column>
            <Column>
              {TIERS[tier].requirements.map((requirement, i) => (
                <TextGroup inline key={i} style={{ marginBottom: '8px' }}>
                  {messages[requirement.name]}
                  {requirement.complete({
                    emailVerified,
                    mobileVerified,
                    userData,
                    userTiers
                  }) && (
                    <Icon style={{ marginLeft: '5px' }} color='success' size='12px' name='check' />
                  )}
                </TextGroup>
              ))}
            </Column>
          </Row>
        </Content>
        {tierData.state === TIERS_STATES.NONE && (
          <ActionButton
            jumbo
            className='actionButton'
            fullwidth
            nature='primary'
            onClick={() =>
              identityVerificationActions.verifyIdentity({
                needMoreInfo: false,
                origin: 'Unknown',
                tier
              })
            }
            data-e2e={`continueKycTier${tier}Btn`}
          >
            {tierStarted ? (
              <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
            ) : (
              ctas[path([tier, 'level'], TIERS)]
            )}
          </ActionButton>
        )}
        {tierData.state === TIERS_STATES.VERIFIED &&
          (tierLevel === 1 ? (
            <ActionButton
              className='actionButton'
              jumbo
              fullwidth
              nature='primary'
              onClick={() => swapActions.showModal('SettingsProfile')}
              data-e2e='swapNowBtn'
            >
              <FormattedMessage
                id='components.identityverification.tiercard.swap_now'
                defaultMessage='Swap Now'
              />
            </ActionButton>
          ) : (
            <ActionButton
              className='actionButton'
              jumbo
              fullwidth
              nature='primary'
              onClick={() => simpleBuyActions.showModal('SettingsProfile')}
              data-e2e='buyNowBtn'
            >
              <FormattedMessage
                id='components.identityverification.tiercard.buy_now'
                defaultMessage='Buy Crypto Now'
              />
            </ActionButton>
          ))}
      </Container>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch) => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const connector = connect(getData, mapDispatchToProps)

type OwnProps = {
  column: boolean
  emailVerified?: boolean
  mobileVerified?: boolean
  tier: 1 | 2
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(TierCard)
