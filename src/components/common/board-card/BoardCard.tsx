// UI 컴포넌트
import { MarkdownDialog } from '@/components/common'
import {
  Button,
  Checkbox,
  Card,
  LabelDatePicker,
  Separator
} from '@/components/ui'
import { Board } from '@/types'
import { ChevronUp } from 'lucide-react'

function BoardCard({ board }: { board: Board }) {
  return (
    <Card className="w-full flex flex-col items-center p-5">
      {/* 게시물 카드 제목 영역 */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="w-full flex items-center justify-start gap-2">
          <Checkbox className="h-5 w-5" checked={true} />
          <input
            type="text"
            placeholder="등록된 제목이 없습니다."
            className="w-full text-xl outline-none bg-transparent"
            disabled={true}
          />
        </div>
        <Button variant={'ghost'} size={'icon'}>
          <ChevronUp className="text-[#6d6d6d]" />
        </Button>
      </div>
      {/* 캘린더 및 버튼 박스 영역 */}
      <div className="w-full flex items-center justify-between">
        {/* 캘린더 박스 */}
        <div className="flex items-center gap-5">
          <LabelDatePicker label="From" />
          <LabelDatePicker label="To" />
        </div>
        {/* 버튼 박스 */}
        <div className="flex items-center">
          <Button variant={'ghost'} className="font-normal text-[#6d6d6d]">
            Duplicate
          </Button>
          <Button
            variant={'ghost'}
            className="font-normal text-rose-600 hover:text-rose-600 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>
      <Separator className="my-3" />
      <MarkdownDialog board={board}>
        <Button variant={'ghost'} className="font-normal text-[#6d6d6d">
          Add Contents
        </Button>
      </MarkdownDialog>
    </Card>
  )
}

export { BoardCard }
