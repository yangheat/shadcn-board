'use client'

import { supabase } from '@/utils/supabase'
import { createContext, ReactNode, useContext, useState } from 'react'

interface TodoContextType {
  todos: any[]
  refreshTodos: () => Promise<void>
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<any>([])

  const refreshTodos = async () => {
    const { data, error, status } = await supabase.from('todos').select('*')

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
