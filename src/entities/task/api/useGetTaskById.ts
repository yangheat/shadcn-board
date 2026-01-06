'use client'

import { useAtom } from "jotai";
import { toast } from "sonner";
import { taskAtom } from "../model/atoms";
import { supabase } from "@/shared/api/supabase/client";
import { useCallback, useEffect } from "react";

function useGetTasksById(taskId: number) {
  const [task, setTask] = useAtom(taskAtom)
  const getTaskById = useCallback(async () => {
    try {
      const { data, status, error } = await supabase.from('tasks').select('*').eq('id', taskId)
      if (data && status === 200) {
        const taskData = data[0]
        setTask(
          taskData
            ? {
                ...taskData,
                start_date: taskData.start_date
                  ? new Date(taskData.start_date)
                  : undefined,
                end_date: taskData.end_date
                  ? new Date(taskData.end_date)
                  : undefined
              }
            : null
        )
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


  }, [setTask, taskId])
  useEffect(() => {
    if (taskId) getTaskById()
  }, [getTaskById, taskId])

  return { task, getTaskById, setTask }
}

export { useGetTasksById }
