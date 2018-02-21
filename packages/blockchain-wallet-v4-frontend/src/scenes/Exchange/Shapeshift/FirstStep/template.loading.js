import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { SkeletonRectangle, Text } from 'blockchain-info-components'
import CoinConvertorLoading from './ExchangeForm/CoinConvertor/template.loading'
import SelectBoxAccountsLoading from './ExchangeForm/SelectBoxAccounts/template.loading'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 30px 30px 10px 30px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  margin-bottom: 20px;
`

export default (props) => (
  <Wrapper>
    <Header>
      <Text size='12px' weight={300}>
        <FormattedMessage id='scenes.exchange.shapeshift.firststep.step' defaultMessage='Step 1 of 2' />
      </Text>
    </Header>
    <Row>
      <SelectBoxAccountsLoading />
    </Row>
    <Row>
      <CoinConvertorLoading />
    </Row>
    <Row>
      <SkeletonRectangle width='100%' height='40px' color='gray-1' />
    </Row>
  </Wrapper>
)
