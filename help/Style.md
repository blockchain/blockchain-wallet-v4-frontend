
# Dream Wallet Front-end - Style guidelines

## REMINDER

1. Don't write any CSS classes in `assets/sass/resources`
    * **REASON**: The sass-loader will write this CSS in each processed SASS file, resulting in a bigger output.

## Fonts

* Contained in the `assets/fonts` directory.
* Published in the `fonts` directory.

## Images

* Contained in the `assets/img` directory.
* Published in the `img` directory.

## Sass

We use two different types of SASS files.


### Global files

* Contained in the `assets/sass` directory.
* Accessible globally by any react component.
* Should stay very generic as any changes will create unattended side effects.

These files are organized in the following way:

* `elements`: *CSS classes* representing basic elements like buttons, links etc...
    * `button.scss`
    * `grid.scss`
    * `link.scss`
    * `textbox.scss`
    * etc...
* `resources`: *SASS variables and mixins* **ONLY**
    * `_settings.scss` contains global settings used by other resources
    * `colors.scss`: contains color settings
    * `flex.scss`: contains flex mixins
    * `image.scss`: contains images mixins
    * `media-query.scss`: contains media query mixins
    * `mixins.scss`: contains common mixins (we could split this one if it becomes too big.)
    * etc...
* `utilities`: *CSS classes* acting as modifiers (cf. blockchain-css)
    * `borders.scss`:
    * `flex.scss`:
    * `fonts.scss`: contains font-face
    * `general.scss`:
    * `layout.scss`:
    * `opacity.scss`:
    * `spacing.scss`:
    * `typography.scss`:
    * etc...
* `global.scss`: Main entry point of our SASS library. Don't forget to include any new files in this one.

### Local files

* Contained in any REACT component directory (if needed.)
* Named `style.scss`
* Generated CSS Classes will be appended with an unique hash to scope them to the component
    * Example: `landing__2TC_l`


## Example

* Any **global** CSS classes can be used with the attribute `className`
* Any **local** CSS classes can be used with the attribute `styleName`
    * Don't forget to wrap your component with `CSSModules(my_component, style)`

``` javascript
import React from 'react'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Login = (props) => {
  return (
    <section styleName='login'>
      <div className='margin-vertical-100' styleName='login-box'>
        <div className='row padding-vertical-10'>
          <div className='col-md-6'>
            <span className='f-24 capitalize'>Welcome back!</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CSSModules(Login, style)

```

## Build process

### Development

1. sass-resources-loader
    * Use: preload the `assets/resources`

2. sass-loader
    * Use: compile any SASS file in a CSS files using the preloaded resources.
3. css-loader
    * Use: merge all the SASS files in a unique CSS file.

We have 2 different build to manage our global files and local files.

The only difference is that the build for the global files will not hash the css classes.

### Production *(In progress...)*
