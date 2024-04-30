import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { reduxForm } from 'redux-form'

import { ExtractSuccess } from '@core/types'
import { Icon, Link, Text } from 'blockchain-info-components'
import { getData as getUserCountry } from 'components/Banner/selectors'
import TextBox from 'components/Form/TextBox'
import { PageTitle, SceneWrapper, StickyHeader, SubTitle, Title } from 'components/Layout'

import { getData } from './selectors'
import Failure from './template.failure'
import Loading from './template.loading'
import PricesTable from './template.success'
import { IconField, SearchIconWrapper, TextFilterWrapper } from './styles'
import { useRemote } from 'hooks'
import { prices } from 'data/actions'

const Scene = ({ children }) => {
  const { country, signupCountry } = useSelector(getUserCountry, shallowEqual)
  const isUkUser = [country, signupCountry].some((code) => code === 'GB')

  return (
    <SceneWrapper>
      <StickyHeader style={{ paddingBottom: '20px' }}>
        <PageTitle>
          <div>
            <Title>
              <Icon size='36px' color='blue600' name='compass' />
              <Text color='grey800' size='32px' weight={600}>
                <FormattedMessage id='copy.prices' defaultMessage='Prices' />
              </Text>
            </Title>
            <SubTitle>
              <Text color='grey600' size='16px' weight={500}>
                <FormattedMessage
                  id='scenes.prices.subtitle'
                  defaultMessage='Buy, Sell and Swap all of the assets offered by our wallet.'
                />
              </Text>
            </SubTitle>
            {isUkUser && (
              <SubTitle>
                <Text color='grey600' size='14px' weight={500}>
                  Real-time data is obtained from multiple sources and may sometimes be delayed due
                  to system performance issues. Past performance is not a reliable indicator of
                  future results. Find out more about various crypto assets and their risks{' '}
                  <Link
                    size='14px'
                    href='https://support.blockchain.com/hc/en-us/articles/10857167024156-Various-Cryptoassets-and-Their-Risks'
                    target='_blank'
                    style={{ textDecoration: 'underline' }}
                  >
                    here
                  </Link>
                  .
                </Text>
              </SubTitle>
            )}
          </div>
          <TextFilterWrapper>
            <IconField
              component={TextBox}
              height='42px'
              data-e2e='pricesTextFilter'
              name='textFilter'
              placeholder='Search'
            />
            <SearchIconWrapper>
              <Icon name='magnifier' size='20px' color='grey400' />
            </SearchIconWrapper>
          </TextFilterWrapper>
        </PageTitle>
      </StickyHeader>
      {children}
    </SceneWrapper>
  )
}

const PricesContainer = () => {
  const { data, isLoading, isNotAsked, error } = useRemote(getData)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(prices.fetchCoinPrices())
    dispatch(prices.fetchCoinPricesPreviousDay())
  }, [])

  if (error) {
    return (
      <Scene>
        <Failure />
      </Scene>
    )
  }

  if (isLoading || isNotAsked || !data) {
    return (
      <Scene>
        <Loading />
      </Scene>
    )
  }

  return (
    <Scene>
      <PricesTable data={data} />
    </Scene>
  )
}

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export default reduxForm({ form: 'prices' })(PricesContainer)
