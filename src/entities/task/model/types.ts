import type { Board } from '@/entities/board'

export interface Task {
  id: number
  title: string
  start_date: Date | undefined
  end_date: Date | undefined
  boards: Board[]
}
