import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Row = styled.div`
  padding: 40px 0;
`

const RotatedIcon = styled.i`
  transform: ${props => props.rotated && 'rotate(-180deg)'}
`

const Description = styled.div`
  width: 75%;
  padding-top: 30px;
  font-size: 0.9rem;
`

export const FaqRow = ({ onToggle, toggled, component }) => (
  <Row className='row justify-content-between border-bottom'>
    <div className='col-12'>
      <div className='d-flex flex-row justify-content-between h6' onClick={onToggle}>
        {component.title}
        <RotatedIcon className='d-flex margin-right-20 icon-down_arrow' rotated={toggled} />
      </div>
      {toggled && (
        <Description className='d-flex flex-row justify-content-start'>
          {component.description}
        </Description>
      )}
    </div>
  </Row>
)

FaqRow.propTypes = {
  component: PropTypes.shape({
    title: PropTypes.object.isRequired,
    description: PropTypes.object.isRequired
  })
}

export default class FaqRowContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { toggled: false }
  }

  render () {
    let { toggled } = this.state
    let handleToggle = () => this.setState({ toggled: !toggled })
    return (
      <FaqRow toggled={toggled} onToggle={handleToggle} {...this.props} />
    )
  }
}
