'use client'

import { useEffect } from 'react'

// Hooks
import { useTodos } from '@/contexts/TodoContext'
import { useCreateTask } from '@/hooks/apis'

// Shadcn UI
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@/components/ui'
import { Search } from 'lucide-react'

function SideNavigation() {
  const { refreshTodos } = useTodos()

  // TASK 생성
  const handleCreateTask = useCreateTask()

  // 마운트 시 초기 데이터 로드
  useEffect(() => {
    refreshTodos()
  }, [])

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
            {/* Supabase에서 생성한 데이터가 없을 경우 */}
            <li className="bg-[#f5f5f5] min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm text-neutral-400">
              <div className="h-[6px] w-[6px] rounded-full bg-neutral-400"></div>
              등록된 Task가 없습니다.
            </li>
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default SideNavigation
