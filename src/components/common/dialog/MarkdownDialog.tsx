'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/utils/supabase'
// Component
import LabelCalendar from '@/components/calendar.bak/LabelCalendar'
import MDEditor from '@uiw/react-md-editor'
// Shadcn UI
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Separator,
  Checkbox
} from '@/components/ui'
import { toast } from 'sonner'
// CSS
import styles from './MarkdownDialog.module.scss'
import { useTodos } from '@/contexts/TodoContext'

interface Todo {
  id: number
  title: string
  start_date: string | Date
  end_date: string | Date
  contents: BoardContent[]
}

interface BoardContent {
  boardId: string | number
  isCompleted: boolean
  title: string
  startDate: string | Date
  endDate: string | Date
  content: string
}

function MarkdownDialog({ data }: { data: BoardContent }) {
  const pathname = usePathname()
  const { todos, refreshTodos } = useTodos()
  const [open, setOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [content, setContent] = useState<string | undefined>(
    '**Hello, World!!**'
  )

  // Supabase에 저장
  const onSubmit = async (id: string | number) => {
    if (!title || !startDate || !endDate || !content) {
      toast('기입되지 않은 데이터(값)가 있습니다.', {
        description: '제목, 날짜 혹은 컨텐츠 값을 모두 작성해주세요.'
      })
      return
    } else {
      // 해당 Board에 대한 데이터만 수정이 되도록 한다.
      if (todos !== null) {
        todos.forEach(async (todo: Todo) => {
          if (todo.id === Number(pathname.split('/')[2])) {
            todo.contents.forEach((board: BoardContent) => {
              if (board.boardId === id) {
                board.title = title
                board.content = content
                board.startDate = startDate
                board.endDate = endDate
              } else {
                board.title = board.title
                board.content = board.content
                board.startDate = board.startDate
                board.endDate = board.endDate
              }
            })

            // Supabase 데이터베이스 연동
            const { data, error, status } = await supabase
              .from('todos')
              .update({ contents: todo.contents })
              .eq('id', pathname.split('/')[2])

            if (error) {
              console.log(error)
              toast.error('에러가 발생했습니다.', {
                description: '콘솔 창에 출력된 에러를 확인하세요.'
              })
            }

            if (status === 204) {
              toast.success('수정 완료!', {
                description: '작성한 글이 Supabase에 올바르게 수정되었습니다.'
              })

              // 등록 후 조건 초기화
              setOpen(false)
              refreshTodos()
            }
          }
        })
      }
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">
          {data.title ? 'Update Contents' : 'Add Contents'}
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-fit!">
        <DialogHeader>
          <DialogTitle>
            <div className={styles.dialog__titleBox}>
              <Checkbox className="w-5 h-5" />
              <input
                type="text"
                placeholder="Write a title for your board."
                value={data.title || title}
                className={styles.dialog__titleBox__title}
                onChange={(event) => setTitle(event.target.value)}
              ></input>
            </div>
          </DialogTitle>
          <div className={styles.dialog__calendarBox}>
            <LabelCalendar
              label="From"
              date={startDate}
              handleDate={setStartDate}
            />
            <LabelCalendar label="To" date={endDate} handleDate={setEndDate} />
          </div>
          <Separator />
          <div className={styles.dialog__markdown}>
            <MDEditor
              value={data.content || content}
              height={100 + '%'}
              onChange={setContent}
            />
          </div>
        </DialogHeader>
        <DialogFooter>
          <div className={styles.dialog__buttonBox}>
            <DialogClose asChild>
              <Button
                variant={'ghost'}
                className="font-normal text-gray-400 hover:bg-gray-50 hover:text-gray-500"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white"
              onClick={() => onSubmit(data.boardId)}
            >
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MarkdownDialog
