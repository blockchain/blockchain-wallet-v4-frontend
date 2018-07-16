import React from 'react'
import { TermsAndConditionsMessage } from './validationMessages'

export const checkboxShouldBeChecked = value => value ? undefined : <TermsAndConditionsMessage />
