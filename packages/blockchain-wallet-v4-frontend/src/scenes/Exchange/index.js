import React from 'react'
import styled from 'styled-components'

import ExchangeLayout from 'layouts/Exchange'
import Shapeshift from './Shapeshift'
import Info from './Info'
import Support from './Support'

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  @media(min-width: 992px) { flex-direction: row; }
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`
const ColumnLeft = styled(Column)`
  align-items: flex-end;
  order: 2;
  margin-right: 10px;
  & > :first-child { margin-bottom: 10px; }
  @media(min-width: 992px) {
    order: 1;
    width: 60%;
  }
`
const ColumnRight = styled(Column)`
  order: 1;
  padding: 0;
  margin-bottom: 10px;
  box-sizing: border-box;
  @media(min-width: 992px) {
    order: 2;
    width: 40%;
  }
`
const Exchange = () => (
  <ExchangeLayout>
    <Wrapper>
      <ColumnLeft>
        <Shapeshift />
        <Support />
      </ColumnLeft>
      <ColumnRight>
        <Info />
      </ColumnRight>
    </Wrapper>
  </ExchangeLayout>
)

export default Exchange
