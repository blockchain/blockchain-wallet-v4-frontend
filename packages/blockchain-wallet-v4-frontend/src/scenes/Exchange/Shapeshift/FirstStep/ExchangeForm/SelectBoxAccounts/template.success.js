import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { path, prop } from 'ramda'

import { HeartbeatLoader, Icon, Separator, SelectInput, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  margin-bottom: 20px;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: ${props => props.fullwidth ? '100%' : '45%'};
  flex-grow: 2;
`
const ContainerMiddle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 50px;
  height: 50px;
  flex-grow: 1;

  & > :first-child:hover { color: ${props => props.theme['brand-primary']}; }
`
const DisplayWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;

  & > * { margin-left: 5px; }
`
const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  cursor: not-allowed;

  & > * { margin-left: 5px; }
`
const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;

  & > * { margin-left: 5px; }

  &:hover {
    color: ${props => props.theme['gray-4']};
    background-color: ${props => props.theme['gray-1']};
  }
`

const renderDisplay = item => (
  <DisplayWrapper>
    {path(['value', 'coin'], item) === 'BTC' && <Icon name='bitcoin' size='14px' weight={300} />}
    {path(['value', 'coin'], item) === 'ETH' && <Icon name='ethereum' size='14px' weight={300} />}
    <Text size='14px' weight={300}>{item.text}</Text>
  </DisplayWrapper>
)

const renderHeader = item => (
  <HeaderWrapper>
    {prop('text', item) === 'Bitcoin' && <Icon name='bitcoin' size='14px' weight={300} />}
    {prop('text', item) === 'Ethereum' && <Icon name='ethereum' size='14px' weight={300} />}
    <Text size='14px' weight={300} uppercase>{item.text}</Text>
    <Separator />
  </HeaderWrapper>
)

const renderItem = item => (
  <ItemWrapper>
    <Text size='14px' weight={300}>{item.text}</Text>
  </ItemWrapper>
)

const Success = props => {
  const { elements, source, target, handleSwap, handleChangeSource, handleChangeTarget, loading } = props

  return (
    <Wrapper>
      <Container>
        <Text size='14px' weight={400}>
          <FormattedMessage id='scenes.exchange.shapeshift.firststep.from' defaultMessage='Exchange:' />
        </Text>
        <SelectInput
          elements={elements}
          value={source}
          onChange={handleChangeSource}
          templateDisplay={renderDisplay}
          templateHeader={renderHeader}
          templateItem={renderItem}
          disabled={loading}
        />
      </Container>
      <ContainerMiddle>
        {loading
          ? <HeartbeatLoader width='20px' height='20px' />
          : <Icon name='exchange-2' size='24px' weight={500} cursor onClick={handleSwap} />
        }
      </ContainerMiddle>
      <Container>
        <Text size='14px' weight={400}>
          <FormattedMessage id='scenes.exchange.shapeshift.firststep.to' defaultMessage='Receive:' />
        </Text>
        <SelectInput
          elements={elements}
          value={target}
          onChange={handleChangeTarget}
          templateDisplay={renderDisplay}
          templateHeader={renderHeader}
          templateItem={renderItem}
          disabled={loading}
        />
      </Container>
    </Wrapper>
  )
}

export default Success
