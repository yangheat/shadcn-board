export interface Board {
  id: string
  title: string
  startDate: Date | undefined
  endDate: Date | undefined
  content: string
  isCompleted: boolean
}
