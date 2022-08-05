import React from 'react'
import { createPortal } from 'react-dom'

const createWrapperAndAppendToBody = (wrapperId: string) => {
  const wrapperElement = document.createElement('div')
  wrapperElement.setAttribute('id', wrapperId)
  document.body.appendChild(wrapperElement)
  return wrapperElement
}

export interface IModalPortalProps {
  wrapperId?: string
}

const ModalPortal: React.FC<IModalPortalProps> = ({ children, wrapperId = 'plugin-wrapper' }) => {
  const [wrapperElement, setWrapperElement] = React.useState<HTMLElement | null>(null)

  React.useLayoutEffect(() => {
    let element = document.getElementById(wrapperId)
    let systemCreated = false
    // if element is not found with wrapperId or wrapperId is not provided,
    // create and append to body
    if (!element) {
      systemCreated = true
      element = createWrapperAndAppendToBody(wrapperId)
    }
    setWrapperElement(element)

    return () => {
      // delete the programatically created element
      if (systemCreated && (element as HTMLElement).parentNode) {
        const elementNode = (element as HTMLElement).parentNode

        if (elementNode) {
          elementNode.removeChild(element as HTMLElement)
        }
      }
    }
  }, [wrapperId])

  // wrapperElement state will be null on very first render.
  if (wrapperElement === null) return null

  return createPortal(children, wrapperElement)
}

ModalPortal.defaultProps = {
  wrapperId: 'plugin-wrapper'
}

export default ModalPortal
