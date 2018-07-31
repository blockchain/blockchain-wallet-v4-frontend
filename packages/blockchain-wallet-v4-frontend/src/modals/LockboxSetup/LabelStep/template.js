import React from 'react'

const LabelStep = props => {
  return (
    <React.Fragment>
      <div onClick={() => props.lockboxActions.addDevice()}>
        Device is plugged in but has not been added before. Add label now.
      </div>
    </React.Fragment>
  )
}

export default LabelStep
