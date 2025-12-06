'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
// Shadcn UI
import { Button } from '@/components/ui'
import { toast } from 'sonner'

function InitPage() {
  const router = useRouter()

  // 페이지 생성 및 Supabase 연동
  const handleCreateTask = async () => {
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
        router.push(`/task/${todos[0].id}`)
      } else {
        return
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justiry-center gap-5 mb-6">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          How to start
        </h3>
        <div className="flex flex-col items-center gap-3">
          <small className="text-sm font-normal leading-none">
            1. Create a page
          </small>
          <small className="text-sm font-normal leading-none">
            2. Add boards to page
          </small>
        </div>
        {/* 페이지 추가 버튼 */}
        <Button
          variant="outline"
          className="text-[#E79057] bg-transparent border border-[#E79057] hover:bg-[#FFF9F5] w-[180px]"
          onClick={handleCreateTask}
        >
          Add New Page
        </Button>
      </div>
    </div>
  )
}

export default InitPage
