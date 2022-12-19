import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { BaseFieldProps, Field, formValueSelector, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { ExtractSuccess } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
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

const Scene = ({ children }) => (
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

const PricesContainer = (props: Props) => {
  const { priceActions, rowDataR } = props

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
        <PricesTable data={val} {...props} />
      </Scene>
    )
  })
}

const mapStateToProps = (state) => ({
  rowDataR: getData(state),
  textFilter: formValueSelector('prices')(state, 'textFilter'),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
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
  modalActions: ReturnType<typeof mapDispatchToProps>['modalActions']
  routerActions: ReturnType<typeof mapDispatchToProps>['routerActions']
  swapActions: ReturnType<typeof mapDispatchToProps>['swapActions']
  walletCurrency: ReturnType<typeof selectors.core.settings.getCurrency>
}
export type Props = ConnectedProps<typeof connector>
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export default enhance(PricesContainer) as React.ComponentClass
