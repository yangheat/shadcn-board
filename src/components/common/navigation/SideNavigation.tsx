'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

// Hooks
import { useTodos } from '@/contexts/TodoContext'
import { useCreateTask, useGetTasks } from '@/hooks/apis'

// UI 컴포넌트
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@/components/ui'
import { Search } from 'lucide-react'
// 타입
import { Task } from '@/types'

function SideNavigation() {
  const router = useRouter()
  const { id } = useParams()
  const { tasks, getTasks } = useGetTasks()
  const { refreshTodos } = useTodos()

  // getTasks는 컴포넌트 최초 랜더링 시 한 번만 호출되어야 하므로 useEffect로 호출
  useEffect(() => {
    getTasks()
  }, [id])

  // TASK 생성
  const handleCreateTask = useCreateTask()

  return (
    <aside className="page__aside">
      <div className="flex flex-col h-full gap-3">
        {/* 검색창 UI */}
        <InputGroup>
          <InputGroupInput placeholder="검색어를 입력하세요" />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        {/* Add New Page 버튼 UI */}
        <Button
          className="text-[#E79857] bg-white border border-[#E79857] hover:bg-[#fff9f4]"
          onClick={handleCreateTask}
        >
          Add New Page
        </Button>
        {/* Task 목록 UI */}
        <div className="flex flex-col mt-4 gap-2">
          <small className="text-sm font-medium leading-none text-[#a6a6a6]">
            <span className="text-neutral-700">yangheat님</span>의 TASK
          </small>
          <ul className="flex flex-col">
            {tasks.length === 0 ? (
              // Supabase에서 생성한 데이터가 없을 경우
              <li className="bg-[#f5f5f5] min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm text-neutral-400">
                <div className="h-[6px] w-[6px] rounded-full bg-neutral-400"></div>
                등록된 Task가 없습니다.
              </li>
            ) : (
              tasks.map((task: Task) => (
                <li
                  key={task.id}
                  onClick={() => router.push(`/task/${task.id}`)}
                  className={`${
                    task.id === Number(id) && 'bg-[#f5f5f5]'
                  } min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm cursor-pointer`}
                >
                  <div
                    className={`${
                      task.id === Number(id) ? 'bg-[#00f38d]' : 'bg-neutral-400'
                    } h-[6px] w-[6px] rounded-full`}
                  ></div>
                  <span
                    className={`${
                      task.id !== Number(id) && 'text-neutral-400'
                    }`}
                  >
                    {task.title || '등록된 제목이 없습니다.'}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </aside>
  )
}

export { SideNavigation }
