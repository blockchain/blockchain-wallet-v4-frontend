import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { values } from 'ramda'

import { model } from 'data'
import LowFlow from './template.lowflow'
import { BackButton } from 'components/IdentityVerification'

const handleSubmit = jest.fn()
const onBack = jest.fn()

const { SUPPORTED_DOCUMENTS } = model.components.identityVerification

const supportedDocuments = values(SUPPORTED_DOCUMENTS)

describe('HighFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', () => {
    const component = shallow(
      <LowFlow
        supportedDocuments={supportedDocuments}
        onBack={onBack}
        handleSubmit={handleSubmit}
      />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should trigger onBack on back button click', () => {
    const component = shallow(
      <LowFlow
        supportedDocuments={supportedDocuments}
        onBack={onBack}
        handleSubmit={handleSubmit}
      />
    )
    component
      .find('FooterShadowWrapper')
      .dive()
      .find(BackButton)
      .simulate('click')
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('should trigger submit on submit click', () => {
    const component = shallow(
      <LowFlow
        supportedDocuments={supportedDocuments}
        onBack={onBack}
        handleSubmit={handleSubmit}
      />
    )
    component
      .find('FooterShadowWrapper')
      .dive()
      .find('Button[nature="primary"]')
      .simulate('click')
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
})
