import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { ExtractSuccess } from '@core/remote/types'
import { Icon, Link, Text } from 'blockchain-info-components'
import { StandardRow } from 'components/Rows'
import { actions, selectors } from 'data'
import { media } from 'services/styles'

import { getData as getBackupData } from './selectors'
import Table from './template'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 24px 24px 0;
  border: 1px solid ${(props) => props.theme.grey000};

  ${media.mobile`
    padding: 12px;
  `}
`
const TitleWrapper = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const PricesLink = styled(Link)`
  display: flex;
  align-items: center;
`
const Loading = () => (
  <>
    <StandardRow loading />
    <StandardRow loading />
    <StandardRow loading />
  </>
)

const HoldingsTableContainer = (props: Props) => (
  <Wrapper>
    <TitleWrapper>
      <Text size='16px' weight={600} color='grey800' capitalize>
        <FormattedMessage id='copy.holdings' defaultMessage='Holdings' />
      </Text>
      <LinkContainer to='/prices'>
        <PricesLink>
          <Text size='14px' color='blue600' weight={500} cursor='pointer'>
            <FormattedMessage id='copy.view_prices' defaultMessage='View Prices' />
          </Text>
          <Icon
            name='arrow-right'
            color='blue600'
            style={{ marginLeft: '4px', marginTop: '1px' }}
          />
        </PricesLink>
      </LinkContainer>
    </TitleWrapper>
    {props.data.cata({
      Failure: (e) => (
        <Text size='16px' weight={500} color='grey400' capitalize>
          {e?.toString() || 'Failed to load balances'}
        </Text>
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <Table {...props} coins={val} />
    })}
  </Wrapper>
)

const mapStateToProps = (state) => ({
  backupCoins: getBackupData(state).getOrElse([]),
  data: selectors.balances.getTotalWalletBalancesSorted(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.refresh, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ExtractSuccess<
  ReturnType<typeof selectors.balances.getTotalWalletBalancesSorted>
>
export type Props = ConnectedProps<typeof connector>

export default connector(HoldingsTableContainer)
