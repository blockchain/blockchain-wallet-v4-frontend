export const useUserAlias = ({
  email,
  firstName,
  lastName
}: {
  email: string
  firstName?: string
  lastName?: string
}) => {
  if (firstName && lastName) return `${firstName} ${lastName}`
  return firstName || lastName || email
}
