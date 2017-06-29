import React from 'react'
import styled from 'styled-components'

const Row = styled.div`
  padding: 18px 0;
  border-bottom: 1px solid #ddd;
  font-size: 0.9rem;
`

const SettingRow = (props) => {
  return (
    <Row className='container-fluid'>
      <div className='row justify-content-between'>
        <div className='col-12 col-md-6 padding-bottom-10'>
          {props.component.description}
        </div>
        <div className='col-12 col-md-6 d-flex justify-content-end'>
          {props.component.settings}
        </div>
      </div>
    </Row>
  )
}

export default SettingRow
