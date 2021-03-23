import React from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import {
  SkeletonCircle,
  SkeletonRectangle,
  Text
} from 'blockchain-info-components'
import { ExtractSuccess } from 'core/remote/types'
import { actions } from 'data'
import { media } from 'services/styles'

import { getData } from './selectors'
import Table from './template'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 24px 24px 0;
  border: 1px solid ${props => props.theme.grey000};

  ${media.mobile`
    padding: 12px;
  `}
`
const TitleText = styled(Text)`
  margin-bottom: 8px;
`
const SkeletonLoader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 12px 0;
  > div:last-child {
    flex: 1;
    margin-left: 16px;
  }
`
const Loading = () => (
  <>
    <SkeletonLoader>
      <SkeletonCircle height='36px' width='36px' />
      <SkeletonRectangle height='32px' width='100%' />
    </SkeletonLoader>
    <SkeletonLoader>
      <SkeletonCircle height='36px' width='36px' />
      <SkeletonRectangle height='32px' width='100%' />
    </SkeletonLoader>
    <SkeletonLoader>
      <SkeletonCircle height='36px' width='36px' />
      <SkeletonRectangle height='32px' width='100%' />
    </SkeletonLoader>
  </>
)

const HoldingsTableContainer = props => (
  <Wrapper>
    <TitleText size='16px' weight={500} color='grey400' capitalize>
      <FormattedHTMLMessage id='copy.holdings' defaultMessage='Holdings' />
    </TitleText>
    {props.data.cata({
      Success: val => <Table {...props} {...val} />,
      Failure: e => (
        <Text size='16px' weight={500} color='grey400' capitalize>
          {e?.toString() || 'Failed to load balances'}
        </Text>
      ),
      NotAsked: () => <Loading />,
      Loading: () => <Loading />
    })}
  </Wrapper>
)

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.refresh, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = ConnectedProps<typeof connector>

export default connector(HoldingsTableContainer)
