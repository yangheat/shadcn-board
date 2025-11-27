'use client'

import { Dispatch, SetStateAction } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui'
// CSS
import styles from './LabelCalendar.module.scss'

interface Props {
  label: string
  readonly?: boolean
  date?: Date | undefined
  handleDate?: Dispatch<SetStateAction<Date | undefined>>
}

function LabelCalendar({ label, readonly, date, handleDate }: Props) {
  return (
    <div className={styles.container}>
      <span className={styles.container__label}>{label}</span>
      {/* Shadcn UI - Calendar */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="data-[empty=true]:text-muted-foreground w-[200px] justify-start text-left font-normal"
          >
            <CalendarIcon />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        {!readonly && (
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={handleDate} />
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}

export default LabelCalendar
