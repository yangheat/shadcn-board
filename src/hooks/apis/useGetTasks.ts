'use client'

import { toast } from "sonner"
import { useAtom } from "jotai"
import { supabase } from "@/utils/supabase/client"
import { tasksAtom } from "@/store/atoms"

function useGetTasks() {
  const [tasks, setTasks] = useAtom(tasksAtom)
  const getTasks = async () => {
    try {
      const { data, status, error } = await supabase.from('tasks').select('*')

      // 성공적으로 데이터가 반환될 경우
      if (data && status === 200) setTasks(data)
      if (error) {
        toast.error('에러가 발생했습니다.', {
          description: `Supabase 오류: ${error.message || '알 수 없는 오류'}`
        })
      }
    } catch (error) {
      console.error(error)
      toast.error('네트워크 오류', {
        description: '서버와 연결할 수 없습니다. 다시 시도해주세요.'
      })
    }
  }

  return { tasks, getTasks }
}

export { useGetTasks }