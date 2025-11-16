'use client'

// Component
import LabelCalendar from '@/components/calendar/LabelCalendar'
import MDEditor from '@uiw/react-md-editor'
// Shadcn UI
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
// CSS
import styles from './MarkdownDialog.module.scss'
import { useState } from 'react'

function MarkdownDialog() {
  const [title, setTitle] = useState<string>('')
  const [contents, setContents] = useState<string | undefined>(
    '**Hello, World!!**'
  )

  // Supabase에 저장
  const onSubmit = () => {
    console.log('함수 호출')

    if (title || contents) {
      toast('기입되지 않은 데이터(값)가 있습니다.', {
        // description: '제목, 날짜 혹은 컨텐츠 값을 모두 작성해주세요.'
        description: (
          <span style={{ color: '#3f3f3f' }}>
            Your event was successfully created.
          </span>
        )
      })
      return
    } else {
      // Supabase 데이터베이스 연동
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Button
          variant={'ghost'}
          className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer"
        >
          Add Contents
        </Button> */}
        <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">
          Add Contents
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
                className={styles.dialog__titleBox__title}
                onChange={(event) => setTitle(event.target.value)}
              ></input>
            </div>
          </DialogTitle>
          <div className={styles.dialog__calendarBox}>
            <LabelCalendar label="From" />
            <LabelCalendar label="To" />
          </div>
          <Separator />
          <div className={styles.dialog__markdown}>
            <MDEditor
              value={contents}
              height={100 + '%'}
              onChange={setContents}
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
              onClick={onSubmit}
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
