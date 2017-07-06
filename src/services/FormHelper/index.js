import { passwordStrongness, isValidEmail } from 'services/ValidationHelper'

const required = value => value ? undefined : 'Required'

const validPassword = value => passwordStrongness(value) > 5 ? undefined : 'Not strong enough'

const validEmail = value => isValidEmail(value) ? undefined : 'Invalid email address'

export { required, validPassword, validEmail }
