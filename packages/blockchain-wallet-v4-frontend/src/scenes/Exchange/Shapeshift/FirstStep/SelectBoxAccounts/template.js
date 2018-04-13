import React from 'react'
import styled from 'styled-components'
import { prop } from 'ramda'

import { HeartbeatLoader, Icon, Separator, SelectInput, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 45%;
  flex-grow: 2;
`
const ContainerMiddle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 10%;
  min-width: 50px;
  flex-grow: 1;
  margin-top: 8px;

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
  & > :first-child { margin-right: 5px; }
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
const Error = styled(Text)`
  position: absolute;
  display: block;
  top: -18px;
  right: 0;
  height: 15px;
`
const renderDisplay = item => (
  <DisplayWrapper>
    {prop('value', item) === 'BCH' && <Icon name='bitcoin-cash' size='14px' weight={300} />}
    {prop('value', item) === 'BTC' && <Icon name='bitcoin' size='14px' weight={300} />}
    {prop('value', item) === 'ETH' && <Icon name='ethereum' size='14px' weight={300} />}
    <Text size='14px' weight={300}>{item.text}</Text>
  </DisplayWrapper>
)
const renderHeader = item => (
  <HeaderWrapper>
    {prop('text', item) === 'Bitcoin' && <Icon name='bitcoin-in-circle' size='14px' weight={300} />}
    {prop('text', item) === 'Bitcoin cash' && <Icon name='bitcoin-cash' size='14px' weight={300} />}
    {prop('text', item) === 'Ethereum' && <Icon name='ethereum' size='14px' weight={300} />}
    <Separator align='right'>
      <Text size='14px' weight={300} uppercase>{item.text}</Text>
    </Separator>
  </HeaderWrapper>
)
const renderItem = item => (
  <ItemWrapper>
    <Text size='14px' weight={300}>{item.text}</Text>
  </ItemWrapper>
)

const getErrorState = (meta) => meta.invalid ? 'invalid' : 'valid'

const Success = props => {
  const { elements, source, target, handleSwap, handleChangeSource, handleChangeTarget, loading, meta } = props
  const errorState = getErrorState(meta)

  return (
    <Wrapper>
      <Container>
        <SelectInput
          elements={elements}
          value={source}
          onChange={handleChangeSource}
          templateDisplay={renderDisplay}
          templateHeader={renderHeader}
          templateItem={renderItem}
          disabled={loading}
          errorState={errorState}
        />
      </Container>
      <ContainerMiddle>
        {loading
          ? <HeartbeatLoader width='20px' height='20px' />
          : <Icon name='exchange-2' size='24px' weight={500} cursor onClick={handleSwap} />
        }
      </ContainerMiddle>
      <Container>
        <SelectInput
          elements={elements}
          value={target}
          onChange={handleChangeTarget}
          templateDisplay={renderDisplay}
          templateHeader={renderHeader}
          templateItem={renderItem}
          disabled={loading}
          errorState={errorState}
        />
      </Container>
      {meta.touched && meta.error && <Error size='12px' weight={300} color='error'>{meta.error}</Error>}
    </Wrapper>
  )
}

export default Success
