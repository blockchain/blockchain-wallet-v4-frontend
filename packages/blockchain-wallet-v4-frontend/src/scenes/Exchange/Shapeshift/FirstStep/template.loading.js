
import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { SkeletonRectangle, Text } from 'blockchain-info-components'

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
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: flex-start;
  width: 100%;
  height: ${props => props.height || 'auto'};
  margin-bottom: 10px;
`
const Cell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${props => props.size === 'small' ? 'center' : 'flex-start'};
  width: ${props => props.size === 'small' ? '10%' : '45%'};
  height: 100%;
`

const Loading = props => (
  <Wrapper>
    <Row justify='flex-end'>
      <Text size='12px' weight={300}>
        <FormattedMessage id='scenes.exchange.shapeshift.firststep.step' defaultMessage='Step 1 of 2' />
      </Text>
    </Row>
    <Row>
      <Cell>
        <SkeletonRectangle width='100px' height='20px' />
      </Cell>
      <Cell size='small' />
      <Cell>
        <SkeletonRectangle width='100px' height='20px' />
      </Cell>
    </Row>
    <Row height='50px'>
      <Cell>
        <SkeletonRectangle width='100%' height='25px' />
      </Cell>
      <Cell size='small'>
        <SkeletonRectangle width='20px' height='20px' />
      </Cell>
      <Cell>
        <SkeletonRectangle width='100%' height='25px' />
      </Cell>
    </Row>
    <Row>
      <SkeletonRectangle width='200px' height='20px' />
    </Row>
    <Row height='80px'>
      <Cell>
        <SkeletonRectangle width='100%' height='25px' />
        <SkeletonRectangle width='100%' height='25px' />
      </Cell>
      <Cell size='small'>
        <SkeletonRectangle width='20px' height='20px' />
      </Cell>
      <Cell>
        <SkeletonRectangle width='100%' height='25px' />
        <SkeletonRectangle width='100%' height='25px' />
      </Cell>
    </Row>
    <Row>
      <SkeletonRectangle width='200px' height='15px' />
    </Row>
    <Row>
      <SkeletonRectangle width='100%' height='25px' />
    </Row>
  </Wrapper>
)

export default Loading
