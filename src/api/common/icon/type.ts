export interface IconType {
  id: string
  icon: string
}

export interface IconState extends Record<string, IconType[]> {}
