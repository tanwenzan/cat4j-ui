export type UserLoginType = {
  userName: string
  passWord: string
}

export type UserType = {
  userId: string
  loginType: number
  userName: string
  passWord: string
  role: string
  roleId: string
  permissions: string | string[]
}
