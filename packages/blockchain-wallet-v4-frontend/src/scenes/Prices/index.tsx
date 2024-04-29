import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps, useSelector } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { BaseFieldProps, Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { ExtractSuccess } from '@core/types'
import { Icon, Link, Text } from 'blockchain-info-components'
import { getData as getUserCountry } from 'components/Banner/selectors'
import TextBox from 'components/Form/TextBox'
import { PageTitle, SceneWrapper, StickyHeader, SubTitle, Title } from 'components/Layout'
import { actions, selectors } from 'data'

import { getData } from './selectors'
import Failure from './template.failure'
import Loading from './template.loading'
import PricesTable from './template.success'

const TextFilterWrapper = styled.div`
  display: flex;
  position: relative;
  width: 300px;
`
const IconField = styled(Field)<BaseFieldProps & { height: string; placeholder: string }>`
  div > input {
    padding-left: 40px;
  }
`
const SearchIconWrapper = styled.div`
  position: absolute;
  top: 12px;
  left: 10px;
`

const Scene = ({ children }) => {
  const isUserFromUK = useSelector(getUserCountry)?.country === 'GB'
  const isSignupFromUk = useSelector(getUserCountry)?.signupCountry === 'GB'

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
            {(isUserFromUK || isSignupFromUk) && (
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

const PricesContainer = (props: OwnProps) => {
  const { priceActions, rowDataR, ...rest } = props

  useEffect(() => {
    priceActions.fetchCoinPrices()
    priceActions.fetchCoinPricesPreviousDay()
  }, [])

  return rowDataR.cata({
    Failure: () => (
      <Scene>
        <Failure />
      </Scene>
    ),
    Loading: () => (
      <Scene>
        <Loading />
      </Scene>
    ),
    NotAsked: () => (
      <Scene>
        <Loading />
      </Scene>
    ),
    Success: (val) => (
      <Scene>
        <PricesTable data={val} {...rest} />
      </Scene>
    )
  })
}

const mapStateToProps = (state) => ({
  rowDataR: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  priceActions: bindActionCreators(actions.prices, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)
const enhance = compose(reduxForm({ form: 'prices' }), connector)

export type TableColumnsType = {
  analyticsActions: ReturnType<typeof mapDispatchToProps>['analyticsActions']
  buySellActions: ReturnType<typeof mapDispatchToProps>['buySellActions']
  formActions: ReturnType<typeof mapDispatchToProps>['formActions']
  isCoinViewV2Enabled: boolean
  isUkUser: boolean
  modalActions: ReturnType<typeof mapDispatchToProps>['modalActions']
  routerActions: ReturnType<typeof mapDispatchToProps>['routerActions']
  swapActions: ReturnType<typeof mapDispatchToProps>['swapActions']
  walletCurrency: ReturnType<typeof selectors.core.settings.getCurrency>
}
type OwnProps = ConnectedProps<typeof connector>
export type Props = Omit<OwnProps, 'priceActions' | 'rowDataR'>
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export default enhance(PricesContainer) as React.ComponentClass
