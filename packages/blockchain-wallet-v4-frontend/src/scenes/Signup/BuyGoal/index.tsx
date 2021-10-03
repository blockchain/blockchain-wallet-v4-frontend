import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { find, isEmpty, isNil, propEq, propOr } from 'ramda'
import { InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import { SimpleBuyWidgetGoalDataType } from 'data/types'

import { Card, CardHeader, CardsWrapper, SignInText, SubCard } from '../components'
import SignupForm from '../components/SignupForm'
import { SubviewProps } from '../types'

const BuyCard = styled(Card)`
  max-width: 27rem;
`
const BuyItemWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
  width: 100%;
`
const SimpleWrapper = styled.div`
  display: flex;
  min-width: 0;
`
const AmountWrapper = styled.div`
  display: flex;
  border-radius: 8px;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  border: 1px solid ${(props) => props.theme.grey100};
  padding: 12px;
  margin-right: 16px;
  margin-top: 32px;
  min-width: 0;
`
const CryptoWrapper = styled(AmountWrapper)`
  flex: 3;
  justify-content: initial;
  margin-right: 0;
  min-width: initial;

  > * {
    margin-right: 8px;
  }
`
const Amount = styled(Text)`
  padding-left: 4px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`

const BuyGoal = (props: InjectedFormProps<{}, SubviewProps> & SubviewProps) => {
  const { goals } = props
  const dataGoal = find(propEq('name', 'simpleBuy'), goals)
  const goalData: SimpleBuyWidgetGoalDataType = propOr({}, 'data', dataGoal)
  const { amount, crypto, fiatCurrency } = goalData
  const showBuyHeader =
    !isNil(goalData) && !isEmpty(goalData) && !!fiatCurrency && !!crypto && !!amount
  return (
    <>
      <CardsWrapper>
        <BuyCard>
          <CardHeader>
            <Text size='24px' color='textBlack' weight={600}>
              <FormattedMessage
                defaultMessage='Sign Up to Continue Your Crypto Purchase.'
                id='scenes.register.simplebuy.signup'
              />
            </Text>
          </CardHeader>

          {showBuyHeader && (
            <>
              <BuyItemWrapper>
                <AmountWrapper>
                  <SimpleWrapper>
                    <Text size='16px' color='grey400' weight={500}>
                      {Currencies[fiatCurrency].units[fiatCurrency].symbol}
                    </Text>
                    <Amount size='16px' color='black' weight={500}>
                      {amount}
                    </Amount>
                  </SimpleWrapper>
                </AmountWrapper>

                <CryptoWrapper>
                  <Icon color={crypto} name={crypto} size='24px' weight={400} />
                  <Text capitalize color='black' size='16px' weight={500}>
                    {window.coins[crypto].coinfig.name}
                  </Text>
                  <Text color='grey400' size='16px' uppercase weight={500}>
                    {crypto}
                  </Text>
                </CryptoWrapper>
              </BuyItemWrapper>

              <Text size='14px' color='grey600' weight={500}>
                <FormattedMessage
                  id='scenes.register.simplebuy.change'
                  defaultMessage='You will be able to change your amount later.'
                />
              </Text>
            </>
          )}

          <SignupForm {...props} />
        </BuyCard>
      </CardsWrapper>
      <LinkContainer to='/login'>
        <Link>
          <SubCard>
            <Text size='14px' color='whiteFade600' weight={500}>
              <FormattedMessage
                id='scenes.register.wallet.link'
                defaultMessage='Already have a wallet?'
              />
            </Text>
            &nbsp;
            <SignInText color='whiteFade900' size='14px' weight={500}>
              <FormattedMessage id='scenes.register.wallet.signin' defaultMessage='Sign In' />
            </SignInText>
          </SubCard>
        </Link>
      </LinkContainer>
    </>
  )
}

export default BuyGoal
