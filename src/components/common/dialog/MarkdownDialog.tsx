'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useAtomValue } from 'jotai'

import { taskAtom } from '@/store/atoms'
import { useTodos } from '@/contexts/TodoContext'
import { useCreateBoard } from '@/hooks/apis'

// 타입
import { Task, Board } from '@/types'

// UI 컴포넌트
import MDEditor from '@uiw/react-md-editor'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Checkbox,
  LabelDatePicker,
  Separator
} from '@/components/ui'

interface MarkdownDialogProps {
  children: ReactNode
  board: Board
}

function MarkdownDialog({ children, board }: MarkdownDialogProps) {
  const { id } = useParams()
  const updateBoard = useCreateBoard()
  const task = useAtomValue(taskAtom)

  // 해당 컴포넌트에서 사용되는 상태 값
  const { todos, refreshTodos } = useTodos()
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [isDialogopen, setisDialogOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [content, setContent] = useState<string | undefined>(
    '**Hello, World!!**'
  )

  // 상태 값 초기화
  const initState = () => {
    setIsCompleted(board.isCompleted || false)
    setTitle(board.title || '')
    setStartDate(board.startDate ? new Date(board.startDate) : undefined)
    setEndDate(board.endDate ? new Date(board.endDate) : undefined)
    setContent(board.content || '**Hellow, World!!**')
  }

  useEffect(() => {
    initState()
  }, [board])

  // 다이얼로그 닫기
  const handleCloseDialog = () => {
    setisDialogOpen(false)
    // TODO: 이거 핦 필요있는지 구현 후 확인
    initState()
  }

  // 등록 버튼 클릭 시
  const handleSubmit = async (boardId: string) => {
    if (!title || !content) {
      toast.error('기입되지 않은 데이터(값)가 있습니다.', {
        description: '제목, 컨텐츠 값은 필수 값입니다. 모두 작성해주세요.'
      })
      return
    }

    // 해당 Board에 대한 데이터만 수정
    try {
      // boards 배열에서 선택한 board를 찾고, 수정된 값으로 업데이트
      const newBoard = task?.boards.map((board: Board) => {
        if (board.id === boardId) {
          return { ...board, isCompleted, title, startDate, endDate, content }
        }
        return board
      })

      await updateBoard(Number(id), 'boards', newBoard)
      handleCloseDialog()
    } catch (error) {
      // 네트워크 오류나 예기치 않은 에러를 잡기 위한 catch 구문 사용
      toast.error('네트워크 오류', {
        description: '서버와 연결할 수 없습니다. 다시 시도해주세요!'
      })
      throw error
    }
  }

  return (
    <Dialog open={isDialogopen} onOpenChange={setisDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-start gap-2">
              <Checkbox
                className="w-5 min-w-5 h-5"
                checked={isCompleted}
                onCheckedChange={(checked) => {
                  if (typeof checked === 'boolean') setIsCompleted(checked)
                }}
              />
              <input
                type="text"
                placeholder="게시물의 제목을 입력하세요."
                className="w-full text-xl outline-none bg-transparent"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </DialogTitle>
          <DialogDescription>
            마크다운 데이터를 사용하여 TODO-BOARD를 예쁘게 꾸며보세요.
          </DialogDescription>
        </DialogHeader>
        {/* 캘린더 박스 */}
        <div className="flex items-center gap-5">
          <LabelDatePicker
            label="From"
            value={startDate}
            onChange={setStartDate}
          />
          <LabelDatePicker label="To" value={endDate} onChange={setEndDate} />
        </div>
        <Separator />
        {/* 마크다운 에디터 UI 영역 */}
        <MDEditor height={320 + 'px'} value={content} onChange={setContent} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>취소</Button>
          </DialogClose>
          <Button
            type="submit"
            className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white"
            onClick={() => handleSubmit(board.id)}
          >
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { MarkdownDialog }
