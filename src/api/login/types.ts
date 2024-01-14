export type UserLoginType = {
  userName: string
  passWord: string
}

export type UserType = {
  loginType: number
  userName: string
  passWord: string
}

export type UserInfo = {
  loginId: string
  userName: string
  tokenName: string
  tokenValue: string
  loginDevice: string
  tag: string
  roles: string[]
  permissions: string[]
}
