'use client'

import { useTodos } from "@/contexts/TodoContext"
import { supabase } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"



function useCreateTask() {
  const router = useRouter()
  const { todos, refreshTodos } = useTodos()
  const createTask = async () => {
    try {
      const { data, status, error } = await supabase.from('tasks').insert([{
        title: null,
        start_date: null,
        end_date: null,
        boards: []
      }]).select()

      if (data && status === 201) {
        // tasks 테이블에 row 데이터가 정상적으로 생성되면 실행
        toast.success('새로운 TASK가 생성이 되었습니다.', {
          description: '나만의 TODO-BOARD를 생성해보세요!'
        })
        router.push(`/task/${data[0].id}`)
        await refreshTodos()
      }

      if (error) {
        toast.error('에러가 발생했습니다.', {
          description: `Supabase 오류: ${error.message || '알 수 없는 오류'}`
        })
      }
    } catch (error) {
      console.log(error)
      toast.error('네트워크 오류', {
        description: '서버와 연결할 수 없습니다. 다시 시도해주세요.'
      })
    }
  }

  return createTask
}

export { useCreateTask }