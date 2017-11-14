import React from 'react'
import styled from 'styled-components'
import { SelectInput } from 'blockchain-info-components'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`
const Cell = styled.div`
  width: 50%;
`
const SelectBoxesAccounts = (props) => {
  const { items, source, target, handleSelectSource, handleSelectTarget, ...rest } = props

  return (
    <Row>
      <Cell>
        <SelectInput elements={items} value={source} onChange={handleSelectSource} {...rest} />
      </Cell>
      <Cell>
        <SelectInput elements={items} value={target} onChange={handleSelectTarget} {...rest} />
      </Cell>
    </Row>
  )
}

export default SelectBoxesAccounts
