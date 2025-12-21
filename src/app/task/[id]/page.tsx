'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'

// Hooks
import { useCreateBoard } from '@/hooks/apis'
import { useTodos } from '@/contexts/TodoContext'

// UI Components
import { Progress, Button, LabelDatePicker } from '@/components/ui'
import { supabase } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { ChevronLeft } from 'lucide-react'

// CSS
import styles from './page.module.scss'

// Types
import { Board } from '@/types'
import { BoardCard } from '@/components/common'
import Image from 'next/image'

function page() {
  const router = useRouter()
  const id = useParams()
  const createBoard = useCreateBoard()

  const [title, setTitle] = useState<string>('')
  const { todos, refreshTodos } = useTodos()
  const todo = todos.find((todo) => todo.id === Number(id))
  const [boards, setBoards] = useState<Board[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setendDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    if (todo) {
      setTitle(todo.title)
      setBoards(todo.contents)
    } else {
      setTitle('')
      setBoards([])
    }
  }, [todos])

  // TASK 내의 Board 생성
  const handleAddBoard = () => {
    const newBoard: Board = {
      id: nanoid(),
      isCompleted: false,
      title: '',
      startDate: undefined,
      endDate: undefined,
      content: ''
    }

    const newBoards = [...boards, newBoard]
    setBoards(newBoards)
    // 실제 Supabase와 통신하는 Hook 로직
    createBoard(Number(id), 'boards', newBoards)
  }

  // 저장
  const handleSave = async () => {
    // const { data, error, status } = await supabase
    //   .from('todos')
    //   .update({
    //     title
    //   })
    //   .eq('id', id)
    // if (error) {
    //   toast.error('에러가 발생했습니다.', {
    //     description: '콘솔 창에 출력된 에러를 확인하세요/'
    //   })
    // }
    // if (status === 204) {
    //   toast.success('수정 완료!', {
    //     description: '작성한 게시물이 Supabase에 올바르게 저장되었습니다.'
    //   })
    //   refreshTodos()
    // }
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles['header__btn-box']}>
          <Button
            variant={'outline'}
            size={'icon'}
            onClick={() => router.push('/')}
          >
            <ChevronLeft />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant={'secondary'} onClick={handleSave}>
              저장
            </Button>
            <Button className="text-rose-600 bg-red-50 hover:bg-rose-50">
              삭제
            </Button>
          </div>
        </div>
        <div className={styles.header__top}>
          {/* 제목 입력 Input 섹션*/}
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter Title Here!"
            className={styles.header__top__input}
          />
          {/* 진행상황 척도 그래프 섹션 */}
          <div className="flex items-center justify-start gap-4">
            <small className="text-sm font-medium leading-none text-[#6d6d6d]">
              1/10 Completed
            </small>
            <Progress className="w-60 h-[10px]" value={33} />
          </div>
          {/* 캘린더 + Add New Board 버튼 섹션 */}
          <div className={styles.header__top__bottom}>
            <div className="flex items-center gap-5">
              <LabelDatePicker label={'From'} />
              <LabelDatePicker label={'From'} />
            </div>
            <Button
              className="text-white bg-[#E79057] hover:bg-[#E79057] hover:ring-[#E79057] hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg"
              onClick={handleAddBoard}
            >
              Add New Board
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        {boards.length !== 0 ? (
          <div className={styles.body__isDate}>
            {/* Add new Board 버튼 클릭으로 인한 Board 데이터가 있을 경우 */}
            {boards.map((board: Board) => {
              return <BoardCard key={board.id} board={board} />
            })}
          </div>
        ) : (
          <div className={styles.body__noData}>
            {/* Add new Board 버튼 클릭으로 인한 Board 데이터가 없을 경우 */}
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              There is no board yet.
            </h3>
            <small className="text-sm font-medium leading-none text-[#6d6d6d] mt-3 mb-7">
              Click the button and start flashing!
            </small>
            <button onClick={handleAddBoard}>
              <Image
                src={'/assets/images/round-button.png'}
                width={74}
                height={74}
                alt="rounded-button"
              />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default page
