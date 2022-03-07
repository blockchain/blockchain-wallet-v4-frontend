import React from 'react'
import { shallow } from 'enzyme'

import { AboutSection } from '.'

describe('AboutSection', () => {
  it('Should display the title, content and actions', () => {
    const title = 'Bitcoin'
    const content = 'The world’s first cryptocurrency'

    const component = shallow(
      <AboutSection
        title={title}
        content={content}
        actions={[<span key={1}>action1</span>, <span key={2}>action2</span>]}
      />
    )

    expect(component.contains(title)).toBe(true)
    expect(component.contains(content)).toBe(true)
    expect(component.contains('action1')).toBe(true)
    expect(component.contains('action2')).toBe(true)
  })
})
