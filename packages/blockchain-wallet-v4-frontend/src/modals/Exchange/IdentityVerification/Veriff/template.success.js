import { createVeriffFrame } from '@veriff/incontext-sdk'
import { useEffect } from 'react'

function Success ({ handleVeriffMessage, url }) {
  useEffect(() => {
    createVeriffFrame({
      url,
      onEvent: handleVeriffMessage
    })
  }, [])

  return null
}

export default Success
