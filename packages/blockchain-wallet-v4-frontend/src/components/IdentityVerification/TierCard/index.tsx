import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { actions, model } from 'data'
import { all, path, propEq } from 'ramda'
import { bindActionCreators } from 'redux'
import { Button, Icon, Text, TextGroup } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { ctas, headers, limits, messages, status } from './services'
import { Exchange } from 'blockchain-wallet-v4/src'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { TIERS } from './model'
import { UserDataType, UserTiersType } from 'data/types'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  border-radius: 8px;
  position: relative;
  flex-direction: column;
  border: 1px solid ${props => props.theme.grey000};
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
    border-right: 1px solid ${props => props.theme.grey000};
  }
  ${Wrapper}.column & {
    text-align: center;
    &:first-child {
      margin-right: 0px;
      border-right: 0px;
      border-bottom: 1px solid ${props => props.theme.grey000};
      padding-bottom: 15px;
      margin-bottom: 15px;
    }
  }
`
const Announcement = styled(Text)`
  display: flex;
  background: linear-gradient(180deg, #162241 0%, #324069 100%);
  border-radius: 8px 8px 0 0;
  justify-content: center;
  align-items: center;
  letter-spacing: 2px;
  height: 50px;
`
const Content = styled.div`
  margin-top: 10px;
`
export const ActionButton = styled(Button)`
  margin-top: 20px;
`

const { TIERS_STATES } = model.profile

type LinkDispatchPropsType = {
  goToSwap: () => void
  identityVerificationActions: typeof actions.components.identityVerification
}

type OwnProps = {
  column: boolean
  emailVerified: boolean
  mobileVerified: boolean
  tier: 1 | 2
  userData: UserDataType
  userTiers: UserTiersType
}

type Props = LinkDispatchPropsType & OwnProps

export const TierCard = ({
  column,
  emailVerified,
  goToSwap,
  mobileVerified,
  tier,
  userData,
  userTiers,
  identityVerificationActions
}: Props) => {
  const tierData = userTiers.find(userTier => userTier.index === tier)
  if (!tierData) return null
  const limitType: 'daily' | 'annual' = TIERS[tier].limit.toLowerCase()
  const tierFiatLimit =
    Exchange.getSymbol(tierData.limits.currency) +
    Currency.formatFiat(tierData.limits[limitType], 0)
  const tierLimit = limits[path([tier, 'limit'], TIERS)]
  const tierStatus = status(tier, userTiers, path([tier, 'time'], TIERS))
  const isRejected = all(propEq('state', TIERS_STATES.REJECTED), userTiers)

  const tierStarted = userData.tiers && userData.tiers.selected >= tier

  let className = ''
  if (column) className += ' column'
  if (isRejected) className += ' rejected'

  return (
    <Wrapper className={className}>
      {tier === 2 && (
        <Announcement uppercase weight={500} size='18px' color='white'>
          <FormattedMessage
            id='components.identityverification.tiercard.getfreecrypto'
            defaultMessage='Get Free Crypto'
          />
        </Announcement>
      )}
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
              <Text
                size='14px'
                weight={500}
                color='textBlack'
                style={{ marginTop: '8px' }}
              >
                {tierLimit}
              </Text>
              <Text
                size='14px'
                weight={500}
                color='grey400'
                style={{ marginTop: '7px' }}
              >
                {tierStatus}
              </Text>
            </Column>
            <Column>
              {TIERS[tier].requirements.map((requirement, i) => (
                <TextGroup inline key={i} style={{ marginBottom: '8px' }}>
                  {messages[requirement.name]}
                  {requirement.complete({
                    userData,
                    userTiers,
                    mobileVerified,
                    emailVerified
                  }) && (
                    <Icon
                      style={{ marginLeft: '5px' }}
                      color='success'
                      size='12px'
                      name='check'
                    />
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
            onClick={() => identityVerificationActions.verifyIdentity(tier)}
            data-e2e={`continueKycTier${tier}Btn`}
          >
            {tierStarted ? (
              <FormattedMessage
                id='components.identityverification.tiercard.continue'
                defaultMessage='Continue'
              />
            ) : (
              ctas[path([tier, 'level'], TIERS)]
            )}
          </ActionButton>
        )}
        {tierData.state === TIERS_STATES.VERIFIED && (
          <ActionButton
            className='actionButton'
            jumbo
            fullwidth
            nature='primary'
            onClick={goToSwap}
            data-e2e='swapNowBtn'
          >
            <FormattedMessage
              id='components.identityverification.tiercard.swap_now'
              defaultMessage='Swap Now'
            />
          </ActionButton>
        )}
      </Container>
    </Wrapper>
  )
}

const mapDispatchToProps = dispatch => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  goToSwap: () => dispatch(actions.router.push('/swap'))
})

export default connect(
  getData,
  mapDispatchToProps
)(TierCard)
