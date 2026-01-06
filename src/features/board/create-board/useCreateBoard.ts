'use client'

import { Board } from "@/entities/board"
import { supabase } from "@/shared/api/supabase/client"
import { toast } from "sonner"

function useCreateBoard() {
  const createBoard = async (taskId: number, column: string, newValue: Board[] | undefined) => {
    try {
      const { data, status, error } = await supabase.from('tasks').update({
        [column]: newValue
      })
        .eq('id', taskId)
        .select()

      if (data && status === 200) {
        // tasks 테이블에 row 데이터가 정상적으로 생성되면 실행
        toast.success('새로운 TODO-BOARD를 생성하였습니다.', {
          description: '나만의 TODO-BOARD를 알차게 채워보세요!!'
        })
      }

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
  return createBoard
}

export { useCreateBoard }
