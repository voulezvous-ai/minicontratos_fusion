export interface LogLine {
  id: string
  who: string
  did: string
  this: string
  when: string
  confirmed_by?: string
  if_ok?: string
  if_doubt?: string
  if_not?: string
  status?: string
  valid: boolean
  ghost: boolean
  missing: string[]
}
