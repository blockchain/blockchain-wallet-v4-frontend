import React from 'react'
import styled from 'styled-components'
import { Icon, SelectInput } from 'blockchain-info-components'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`
const Cell = styled.div`
  width: 45%;
`

const SwapIcon = styled(Icon)`
  cursor: pointer;
`

const SelectBoxesAccounts = (props) => {
  const { items, source, target, handleSelectSource, handleSelectTarget, handleSwap, ...rest } = props

  return (
    <Row>
      <Cell>
        <SelectInput elements={items} value={source} onChange={handleSelectSource} {...rest} />
      </Cell>
      <SwapIcon size='22px' onClick={handleSwap} name='exchange-2' />
      <Cell>
        <SelectInput elements={items} value={target} onChange={handleSelectTarget} {...rest} />
      </Cell>
    </Row>
  )
}

export default SelectBoxesAccounts
