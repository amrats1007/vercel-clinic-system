"use client"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatDate } from "@/lib/date-utils"
import type { Language } from "@/lib/i18n"

interface DatePickerProps {
  date?: Date
  onDateChange: (date: Date | undefined) => void
  language: Language
  placeholder?: string
  disabled?: (date: Date) => boolean
  className?: string
}

export function DatePicker({
  date,
  onDateChange,
  language,
  placeholder = "Pick a date",
  disabled,
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
          {date ? formatDate(date, language, { format: "medium" }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={language === "ar" ? "end" : "start"}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          disabled={disabled}
          initialFocus
          dir={language === "ar" ? "rtl" : "ltr"}
        />
      </PopoverContent>
    </Popover>
  )
}
