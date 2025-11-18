'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
// Shadcn UI
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
// CSS
import style from './page.module.scss'

function Home() {
  const router = useRouter()

  // 페이지 생성 및 Supabase 연동
  const onCreate = async () => {
    // Supabase 데이터베이스 row 생성
    const {
      data: todos,
      error,
      status
    } = await supabase
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
      toast.success('페이지 생성 완료!', {
        description: '새로운 투두리스트가 생성되었습니다.'
      })

      if (todos) {
        router.push(`/create/${todos[0].id}`)
      } else {
        return
      }
    }
  }
  return (
    <div className={style.container}>
      <div className={style.container__onBoarding}>
        <span className={style.container__onBoarding__title}>
          How to start:
        </span>
        <div className={style.container__onBoarding__steps}>
          <span>1. Create a page</span>
          <span>2. Add boards to page</span>
          {/* 페이지 추가 버튼 */}
        </div>
        <Button
          variant="outline"
          className="w-full bg-transparent text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500"
          onClick={onCreate}
        >
          Add New Page
        </Button>
      </div>
    </div>
  )
}

export default Home
