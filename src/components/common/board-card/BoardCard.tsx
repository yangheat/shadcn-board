'use client'

import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { taskAtom } from '@/store/atoms'
import { useCreateBoard, useDeleteBoard, useGetTasksById } from '@/hooks/apis'
// UI 컴포넌트
import { MarkdownDialog } from '@/components/common'
import {
  Button,
  Checkbox,
  Card,
  LabelDatePicker,
  Separator
} from '@/components/ui'
import MDEditor from '@uiw/react-md-editor'
import { ChevronDown, ChevronUp } from 'lucide-react'
// 타입
import { Board } from '@/types'

function BoardCard({ board }: { board: Board }) {
  const { id } = useParams()
  // TASK의 TODO-BOARD 1건 삭제
  const handleDeleteBoard = useDeleteBoard(Number(id), board.id)

  const task = useAtomValue(taskAtom)
  const updateBoard = useCreateBoard()
  const { getTaskById } = useGetTasksById(Number(id))

  const [startDate, setStartDate] = useState<Date | undefined>(
    board.startDate ? new Date(board.startDate) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    board.endDate ? new Date(board.endDate) : undefined
  )
  const [isShowContent, setIsShowContent] = useState<boolean>(false)

  const handleSaveBoard = async (boardId: string) => {
    if (!board.title) {
      toast.error('TODO-BOARD를 저장할 수 없습니다', {
        description: 'TODO-BOARD를 저장하기 전 제목을 먼저 등록해주세요.'
      })
      return
    }

    if (!startDate || !endDate) {
      toast.error('기입되지 않은 데이터(값)가 있습니다.', {
        description: '시작일과 종료일은 필수 값입니다.'
      })
      return
    }

    // 해당 Board에 대한 데이터만 수정
    try {
      // boards 배열에서 선택한 board를 찾고, 수정된 값으로 업데이트
      const newBoard = task?.boards.map((board: Board) => {
        if (board.id === boardId) {
          return { ...board, startDate, endDate }
        }
        return board
      })

      await updateBoard(Number(id), 'boards', newBoard)
      getTaskById()
    } catch (error) {
      // 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용
      console.log(error)
      toast.error('네트워크 오류', {
        description: '서버와 연결할 수 없습니다. 다시 시도해주세요.'
      })
    }
  }

  return (
    <Card className="w-full flex flex-col items-center p-5">
      {/* 게시물 카드 제목 영역 */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="w-full flex items-center justify-start gap-2">
          <Checkbox className="h-5 w-5" checked={board.isCompleted} />
          <input
            type="text"
            placeholder="등록된 제목이 없습니다."
            className="w-full text-xl outline-none bg-transparent"
            value={board.title}
            disabled={true}
          />
        </div>
        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={() => setIsShowContent((prev) => !prev)}
        >
          {isShowContent ? (
            <ChevronUp className="text-[#6d6d6d]" />
          ) : (
            <ChevronDown className="text-[#6d6d6d]" />
          )}
        </Button>
      </div>
      {/* 캘린더 및 버튼 박스 영역 */}
      <div className="w-full flex items-center justify-between">
        {/* 캘린더 박스 */}
        <div className="flex items-center gap-5">
          <LabelDatePicker
            label="From"
            value={startDate}
            onChange={setStartDate}
          />
          <LabelDatePicker label="To" value={endDate} onChange={setEndDate} />
        </div>
        {/* 버튼 박스 */}
        <div className="flex items-center">
          <Button
            variant={'ghost'}
            className="font-normal text-[#6d6d6d]"
            onClick={() => handleSaveBoard(board.id)}
          >
            Save
          </Button>
          <Button
            variant={'ghost'}
            className="font-normal text-rose-600 hover:text-rose-600 hover:bg-red-50"
            onClick={handleDeleteBoard}
          >
            Delete
          </Button>
        </div>
      </div>
      {isShowContent && (
        <MDEditor
          height={320 + 'px'}
          value={board.content ? board.content : '**Hellow, World!!**'}
          className="w-full mt-[16px]"
        />
      )}
      <Separator className="my-3" />
      <MarkdownDialog board={board}>
        <Button variant={'ghost'} className="font-normal text-[#6d6d6d">
          {board.title ? 'Update ' : 'Add '} Contents
        </Button>
      </MarkdownDialog>
    </Card>
  )
}

export { BoardCard }
