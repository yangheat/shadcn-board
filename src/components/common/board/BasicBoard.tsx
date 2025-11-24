import { usePathname } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import MarkdownDialog from '../dialog/MarkdownDialog'
// Shadcn UI
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronUp } from 'lucide-react'

// CSS
import styles from './BasicBoard.module.scss'
import { useTodos } from '@/contexts/TodoContext'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Dispatch, SetStateAction } from 'react'
import { Card } from '@/components/ui/card'
import MDEditor from '@uiw/react-md-editor'

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

interface Props {
  data: BoardContent
  handleBoards: Dispatch<SetStateAction<BoardContent[]>>
}

function BasicBoard({ data, handleBoards }: Props) {
  const pathname = usePathname()
  const { todos, refreshTodos } = useTodos()
  let todo = todos?.find((todo) => {
    return todo.id === Number(pathname.split('/')[2])
  })

  const handleDelete = async (id: string | number) => {
    // 해당 Board에 대한 데이터만 수정 혹은 삭제
    if (todo) {
      const newContents = todo.contents.filter((content: BoardContent) => {
        return content.boardId !== id
      })

      // Supabase 데이터베이스 다시 저장
      const { data, error, status } = await supabase
        .from('todos')
        .update({
          contents: newContents
        })
        .eq('id', pathname.split('/')[2])
        .select('*')

      if (error) {
        console.log(error)
        toast.error('에러가 발생했습니다.', {
          description: '콘솔 창에 출력된 에러를 확인하세요.'
        })
      }

      if (status === 200) {
        toast.success('삭제가 완료되었습니다.', {
          description: 'Supabase에서 올바르게 삭제되었습니다.'
        })
        if (data) {
          handleBoards(data[0].contents)
          todo.contents = data[0].contents
        }
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.container__header}>
        <div className={styles.container__header__titleBox}>
          <Checkbox className="w-5 h-5" />
          {data.title !== '' ? (
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {data.title}
            </h3>
          ) : (
            <span className={styles.title}>
              It is fulled in after the post is created.
            </span>
          )}
        </div>
        <Button variant={'ghost'}>
          <ChevronUp className="w-5 h-5 text-gray-400" />
        </Button>
      </div>
      <div className={styles.container__body}>
        <div className={styles.container__body__calendsrBox}>
          <div className="flex items-center gap-3">
            <span className="text-[#6d6d6d]">From</span>
            <Input
              value={data.startDate ? format(data.startDate, 'yyyy-MM-dd') : ''}
              disabled
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#6d6d6d]">To</span>
            <Input
              value={data.endDate ? format(data.endDate, 'yyyy-MM-dd') : ''}
              disabled
            />
          </div>
        </div>
        <div className={styles.container__body__buttonBox}>
          <Button
            variant={'ghost'}
            className="font-normal text-gray-400 hover:bg-green-50 hover:text-green-500"
          >
            Duplicate
          </Button>
          <Button
            variant={'ghost'}
            className="font-normal text-gray-400 hover:bg-red-50 hover:text-red-500"
            onClick={() => handleDelete(data.boardId)}
          >
            Delete
          </Button>
        </div>
      </div>
      {data.content && (
        <Card className="w-full p-4 mb-3">
          <MDEditor value={data.content} height={100 + '%'} />
        </Card>
      )}
      <div className={styles.container__footer}>
        <MarkdownDialog data={data} />
      </div>
    </div>
  )
}

export default BasicBoard
