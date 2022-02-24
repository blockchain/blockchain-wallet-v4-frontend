import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { WalletOptionsType } from '@core/types'
import { Icon, Image, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const SceneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 2rem;

  > div {
    cursor: pointer;

    &:not(:last-child) {
      margin-right: 24px;
    }
  }
`

const StyledDiv = styled.div``

const ProductPicker: React.FunctionComponent<{
  domains: {
    comWalletApp: string
    exchange: string
  }
  routerActions: { push: Function }
  runGoals: Function
  saveGoal: Function
}> = (props) => {
  const handleWalletLink = () => {
    const { routerActions, runGoals, saveGoal } = props
    routerActions.push(`${props.domains.comWalletApp}/home`)
    // for first time login users we need to run goal since this is a first page we show them
    saveGoal('welcomeModal', { firstLogin: true })
    runGoals()
  }

  const handleExchangeLink = () => {
    const { routerActions } = props
    routerActions.push(`${props.domains.exchange}/trade`)
  }

  return (
    <SceneWrapper>
      <Icon color='success' name='checkmark-circle-filled' size='2rem' />
      <Text size='1.25rem' weight={600} color='white' style={{ marginTop: '15px' }}>
        <FormattedMessage
          id='scenes.productPicker.account_created'
          defaultMessage='Account Created!'
        />
      </Text>
      <Text
        color='white'
        lineHeight='1.5rem'
        size='1rem'
        style={{ marginTop: '15px' }}
        weight={500}
      >
        <FormattedMessage
          id='scenes.productPicker.select_product'
          defaultMessage='Select a product to launch now.'
        />
      </Text>
      <ContentWrapper>
        <StyledDiv onClick={handleWalletLink} role='button' tabIndex={0}>
          <Image name='wallet-button' />
        </StyledDiv>
        <StyledDiv onClick={handleExchangeLink} role='button' tabIndex={-1}>
          <Image name='exchange-button' />
        </StyledDiv>
      </ContentWrapper>
    </SceneWrapper>
  )
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    exchange: 'https://exchange.blockchain.com'
  } as WalletOptionsType['domains']),
  isEmailVerified: selectors.core.settings.getEmailVerified(state).getOrElse(false)
})

const mapDispatchToProps = (dispatch) => ({
  routerActions: bindActionCreators(actions.router, dispatch),
  runGoals: () => dispatch(actions.goals.runGoals()),
  saveGoal: (name, data) => dispatch(actions.goals.saveGoal({ data, name }))
})

type LinkStatePropsType = {
  domains: WalletOptionsType['domains']
  isEmailVerified: boolean
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(ProductPicker)
