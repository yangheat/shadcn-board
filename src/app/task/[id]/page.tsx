'use client'

import { useParams, useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'

// Hooks
import { useGetTasksById, useGetTasks } from '@/entities/task'
import { useCreateBoard } from '@/features/board'

// UI Components
import { Progress, Button, LabelDatePicker } from '@/shared/ui'
import { ChevronLeft } from 'lucide-react'

// CSS
import styles from './page.module.scss'

// Types
import { Board } from '@/entities/board'
import { BoardCard } from '@/widgets'
import { DeleteTaskPopup } from '@/features/task'
import Image from 'next/image'
import { toast } from 'sonner'
import { supabase } from '@/shared/api/supabase/client'

function TaskPage() {
  const router = useRouter()
  const { id } = useParams()
  const { task, setTask } = useGetTasksById(Number(id))
  const createBoard = useCreateBoard()
  const { getTasks } = useGetTasks()

  const boards = task?.boards ?? []
  const completedCount = task
    ? task.boards.filter((board: Board) => board.isCompleted).length
    : 0

  // TASK 내의 Board 생성
  const handleAddBoard = () => {
    if (!task) return
    const newBoard: Board = {
      id: nanoid(),
      isCompleted: false,
      title: '',
      startDate: undefined,
      endDate: undefined,
      content: ''
    }

    const newBoards = [...task.boards, newBoard]
    setTask({ ...task, boards: newBoards })
    // 실제 Supabase와 통신하는 Hook 로직
    createBoard(Number(id), 'boards', newBoards)
  }

  // 저장
  const handleSave = async () => {
    if (!task?.title || !task.start_date || !task.end_date) {
      toast.error('기입되지 않은 데이터(값)가 있습니다.', {
        description: '제목, 시작일, 종료일은 필수 값입니다.'
      })
      return
    }

    try {
      const { data, status, error } = await supabase
        .from('tasks')
        .update({
          title: task.title,
          start_date: task.start_date,
          end_date: task.end_date
        })
        .eq('id', Number(id))
        .select()

      if (data && status === 200) {
        toast.success('TASK 저장을 완료하였습니다.', {
          description: '수정한 TASK의 마감일을 꼭 지켜주세요!'
        })
        /** 서버에서 데이터 갱신 후 상태값 업데이트
         * SideNavigation 컴포넌트 리스트 정보를 실시간으로 업데이트 하기 위해 getTask 훅을 호출
         */
        getTasks()
        return
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
            <Button
              variant={'secondary'}
              onClick={handleSave}
              className="cursor-pointer"
            >
              저장
            </Button>
            <DeleteTaskPopup>
              <Button className="text-rose-600 bg-red-50 hover:bg-rose-50 cursor-pointer">
                삭제
              </Button>
            </DeleteTaskPopup>
          </div>
        </div>
        <div className={styles.header__top}>
          {/* 제목 입력 Input 섹션*/}
          <input
            type="text"
            value={task?.title ?? ''}
            onChange={(event) => {
              if (!task) return
              setTask({ ...task, title: event.target.value })
            }}
            placeholder="Enter Title Here!"
            className={styles.header__top__input}
          />
          {/* 진행상황 척도 그래프 섹션 */}
          <div className="flex items-center justify-start gap-4">
            <small className="text-sm font-medium leading-none text-[#6d6d6d]">
              {completedCount}/{boards.length} Completed
            </small>
            <Progress
              className="w-60 h-[10px]"
              value={
                boards.length > 0
                  ? (completedCount / boards.length) * 100
                  : 0
              }
            />
          </div>
          {/* 캘린더 + Add New Board 버튼 섹션 */}
          <div className={styles.header__top__bottom}>
            <div className="flex items-center gap-5">
              <LabelDatePicker
                label={'From'}
                value={task?.start_date}
                onChange={(value) => {
                  if (!task) return
                  setTask({ ...task, start_date: value })
                }}
              />
              <LabelDatePicker
                label={'From'}
                value={task?.end_date}
                onChange={(value) => {
                  if (!task) return
                  setTask({ ...task, end_date: value })
                }}
              />
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

export default TaskPage
