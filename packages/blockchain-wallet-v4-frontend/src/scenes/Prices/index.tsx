import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { BaseFieldProps, Field, formValueSelector, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { SceneWrapper } from 'components/Layout'
import { actions, selectors } from 'data'

import { getData } from './selectors'
import Failure from './template.failure'
import Loading from './template.loading'
import PricesTable from './template.success'

const Header = styled.div`
  width: 100%;
  margin-bottom: 32px;
`
const PageTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
`
const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & > :first-child {
    margin-right: 16px;
  }
`
const SubTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 16px 8px 0 0;
`
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
    <Header>
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
    </Header>
    {children}
  </SceneWrapper>
)

const PricesContainer = (props) => {
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
  modalActions: bindActionCreators(actions.modals, dispatch),
  priceActions: bindActionCreators(actions.prices, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose<any>(reduxForm({ form: 'prices' }), connector)

export default enhance(PricesContainer)
