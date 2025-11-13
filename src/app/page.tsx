import { Button } from '@/components/ui/button'
import style from './page.module.scss'
function Home() {
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
        >
          Add New Page
        </Button>
      </div>
    </div>
  )
}

export default Home
