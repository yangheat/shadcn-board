'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
// Components
import LabelCalendar from '@/components/calendar/LabelCalendar'
import BasicBoard from '@/components/common/board/BasicBoard'
// Shadcn UI
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
// CSS
import styles from './page.module.scss'
import { supabase } from '@/utils/supabase'
import { toast } from 'sonner'

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
  startDate: string
  endDate: string
  content: string
}

function page() {
  const router = useRouter()
  const pathname = usePathname()

  const [boards, setBoards] = useState<Todo>()
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setendDate] = useState<Date | undefined>(new Date())

  const insertRowDate = async (contents: BoardContent[]) => {
    // Supabase 데이터베이스 연동
    if (boards?.contents) {
      const { error, status } = await supabase
        .from('todos')
        .update({ contents })
        .eq('id', pathname.split('/')[2])
        .select()

      if (error) {
        console.log(error)
        toast.error('에러가 발생했습니다.', {
          description: '콘솔 창에 출력된 에러를 확인하세요.'
        })
      }

      if (status === 200) {
        toast.success('추가 완료', {
          description: '새로운 Todo Board가 추가되었습니다.'
        })
        getData()
      }
    } else {
      const { error, status } = await supabase
        .from('todos')
        .insert({ contents })
        .eq('id', pathname.split('/')[2])
        .select()

      if (error) {
        console.log(error)
        toast.error('에러가 발생했습니다.', {
          description: '콘솔 창에 출력된 에러를 확인하세요.'
        })
      }

      if (status === 201) {
        toast.success('생성 완료', {
          description: '새로운 Todo Board가 생성되었습니다.'
        })
        getData()
      }
    }
  }

  // Add New Board 버튼을 클릭했을 때
  const createBoard = () => {
    const newContents: BoardContent[] = []
    const BoardContent: BoardContent = {
      boardId: nanoid(),
      isCompleted: false,
      title: '',
      startDate: '',
      endDate: '',
      content: ''
    }

    if (boards && boards.contents.length > 0) {
      newContents.push(...boards.contents)
      newContents.push(BoardContent)
      insertRowDate(newContents)
    } else if (boards && boards.contents.length === 0) {
      newContents.push(BoardContent)
      insertRowDate(newContents)
    }
  }

  // Supabase에 기존에 생성된 보드가 유무 확인
  const getData = async () => {
    const {
      data: todos,
      error,
      status
    } = await supabase
      .from('todos')
      .select('*')
      .eq('id', pathname.split('/')[2])

    // page.tsx getData() 함수
    if (todos && todos[0]) {
      const todo = todos[0]
      setBoards({
        ...todo,
        contents: JSON.parse(todo.contents)
      })
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className={styles.container}>
      <header className={styles.container__header}>
        <div className={styles.container__header__contents}>
          <input
            type="text"
            placeholder="Enter Title Here"
            className={styles.input}
          />
          <div className={styles.progressBar}>
            <span className={styles.progressBar__status}>0/10 completed</span>
            {/* 프로그레스바 UI */}
            <Progress
              value={33}
              className="w-[30%] h-2"
              indicatorColor="bg-green-500"
            />
          </div>
          <div className={styles.calendarBox}>
            <div className={styles.calendarBox__calendar}>
              {/* 캘린더 UI */}
              <LabelCalendar label="From" readonly={true} />
              <LabelCalendar label="To" readonly={true} />
            </div>
            <Button
              variant={'outline'}
              className="w-[15%] border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white "
              onClick={createBoard}
            >
              Add New Board
            </Button>
          </div>
        </div>
      </header>
      <main className={styles.container__body}>
        {boards?.contents.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className={styles.container__body__infoBox}>
              <span className={styles.title}>There is no board yet.</span>
              <span className={styles.subTitle}>
                Click the button and start flashing!
              </span>
              <button className={styles.button}>
                <Image
                  src="/assets/images/round-button.png"
                  alt="round-button"
                  width={100}
                  height={100}
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-start w-full h-full gap-4">
            {boards?.contents.map((board: BoardContent) => (
              <BasicBoard key={board.boardId} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default page
