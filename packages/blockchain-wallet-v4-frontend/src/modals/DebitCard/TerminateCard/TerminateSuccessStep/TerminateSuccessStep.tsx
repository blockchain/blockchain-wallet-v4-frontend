import { useEffect } from 'react'

type Props = {
  handleClose: () => void
}

const TerminateSuccessStep = ({ handleClose }: Props) => {
  useEffect(() => {
    handleClose()
  }, [])

  // Nothing to Show in this step, in V1 a Modal will be displayed
  return null
}

export default TerminateSuccessStep
