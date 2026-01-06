'use client'

import { supabase } from '@/shared/api/supabase/client'
import { createContext, ReactNode, useContext, useState } from 'react'
import { toast } from 'sonner'

interface Todo {
  id: number
  title: string | null
  start_date: string | null
  end_date: string | null
  contents: unknown[] | null
}

interface TodoContextType {
  todos: Todo[]
  refreshTodos: () => Promise<void>
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([])

  const refreshTodos = async () => {
    const { data, error, status } = await supabase.from('todos').select('*')

    if (error) {
      toast.error('데이터 로드 실패!', {
        description: '데이터를 불러오는 중 오류가 발생했습니다.'
      })
      return
    }

    if (data === null || data.length === 0) {
      toast.error('조회 가능한 데이터가 없습니다.', {
        description: '조회 가능한 데이터가 없습니다.'
      })
      return
    }

    if (status === 200) {
      setTodos(data)
    }
  }

  return (
    <TodoContext.Provider value={{ todos, refreshTodos }}>
      {children}
    </TodoContext.Provider>
  )
}

export function useTodos() {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider')
  }

  return context
}
