'use client'

import { supabase } from '@/utils/supabase'
import { createContext, ReactNode, useContext, useState } from 'react'
import { toast } from 'sonner'

interface TodoContextType {
  todos: any[]
  refreshTodos: () => Promise<void>
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<any>([])

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
