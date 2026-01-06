'use client'

import { ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/shared/ui'
import { useParams } from 'next/navigation'
import { useDeleteTask } from '../useDeleteTask'

function DeleteTaskPopup({ children }: { children: ReactNode }) {
  const { id } = useParams()
  const { deleteTask } = useDeleteTask()
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            해당 TASK를 정말로 삭제하시겠습니까?
          </AlertDialogTitle>
          <AlertDialogDescription>
            이 작업이 실행되면 다시 취소할 수 없습니다. <br />
            삭제가 진행되면 귀화의 게시물은 영구적으로 삭제됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteTask(Number(id))}
            className="bg-red-500 hover:bg-red-500 cursor-pointer"
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteTaskPopup }
