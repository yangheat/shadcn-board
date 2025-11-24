'use client'

import { useEffect, useState } from 'react'
// Shadcn UI
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dot, Search } from 'lucide-react'
// CSS
import styles from './SideNavigation.module.scss'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { toast } from 'sonner'
import { useTodos } from '@/contexts/TodoContext'

function SideNavigation() {
  const router = useRouter()
  const { todos, refreshTodos } = useTodos()

  const onCreate = async () => {
    // 1. Supabase 데이터베이스에 row 생성
    const { data, error, status } = await supabase
      .from('todos')
      .insert([
        {
          title: '',
          start_date: new Date(),
          end_date: new Date(),
          contents: []
        }
      ])
      .select()

    if (error) {
      console.log(error)
    }

    if (status === 201) {
      toast('페이지 생성 완료!', {
        description: '새로운 투두리스트가 생성되었습니다.'
      })

      if (data) {
        router.push(`/create/${data[0].id}`)
        await refreshTodos()
      } else {
        return
      }
    }
  }

  // 마운트 시 초기 데이터 로드
  useEffect(() => {
    refreshTodos()
  }, [])

  return (
    <div className={styles.container}>
      {/* 검색창 */}
      <div className={styles.container__searchBox}>
        <Input
          type="text"
          placeholder="검색어를 입력해주세요."
          className="focus-visible:ring-0"
        />
        <Button variant={'outline'} size="icon">
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <div className={styles.container__buttonBox}>
        <Button
          variant={'outline'}
          className="w-full text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500"
          onClick={onCreate}
        >
          Add New Page
        </Button>
      </div>
      <div className={styles.container__todos}>
        <span className={styles.container__todos__label}>Your To do</span>
        {/* Is Supabas Todos */}
        <div className={styles.container__todos__list}>
          {todos &&
            todos.map((todo: any) => (
              <div
                className="flex items-center py-2 bg-[#f5f5f4] rounded-sm cursor-pointer"
                key={todo.id}
              >
                <Dot className="mr-1 text-green-400"></Dot>
                <span className="text-sm">
                  {todo.title === '' ? '제목 업음' : todo.title}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default SideNavigation
