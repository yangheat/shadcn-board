'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
// Components
// Shadcn UI
import { Progress, Button, LabelDatePicker } from '@/components/ui'
import { supabase } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { ChevronLeft } from 'lucide-react'
import { useTodos } from '@/contexts/TodoContext'

import styles from './page.module.scss'

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
  const id = pathname.split('/')[2]

  const [title, setTitle] = useState<string>('')
  const { todos, refreshTodos } = useTodos()
  const todo = todos.find((todo) => todo.id === Number(pathname.split('/')[2]))
  const [boards, setBoards] = useState<BoardContent[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setendDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    if (todo) {
      setTitle(todo.title)
      setBoards(todo.contents)
    } else {
      setTitle('')
      setBoards([])
    }
  }, [todos])

  const insertRowDate = async (contents: BoardContent[]) => {
    // Supabase 데이터베이스 연동
    const { error, status } = await supabase
      .from('todos')
      .update({ contents })
      .eq('id', id)

    if (error) {
      console.log(error)
      toast.error('에러가 발생했습니다.', {
        description: '콘솔 창에 출력된 에러를 확인하세요.'
      })
    }

    if (status === 204) {
      toast.success('추가 완료', {
        description: '새로운 Todo Board가 추가되었습니다.'
      })
      setBoards(contents)
      todo.contents = contents
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

    if (boards.length === 0) {
      newContents.push(BoardContent)
    } else {
      newContents.push(...boards, BoardContent)
    }
    insertRowDate(newContents)
  }

  // 저장
  const handleSave = async () => {
    const { data, error, status } = await supabase
      .from('todos')
      .update({
        title
      })
      .eq('id', id)

    if (error) {
      toast.error('에러가 발생했습니다.', {
        description: '콘솔 창에 출력된 에러를 확인하세요/'
      })
    }

    if (status === 204) {
      toast.success('수정 완료!', {
        description: '작성한 게시물이 Supabase에 올바르게 저장되었습니다.'
      })

      refreshTodos()
    }
  }

  return (
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
          <Button className="text-white bg-[#E79057] hover:bg-[#E79057] hover:ring-[#E79057] hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg">
            Add New Board
          </Button>
        </div>
      </div>
    </div>
  )
}

export default page
