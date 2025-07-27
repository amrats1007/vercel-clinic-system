"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatTime, parseArabicInput } from "@/lib/date-utils"
import type { Language } from "@/lib/i18n"

interface TimePickerProps {
  time?: string
  onTimeChange: (time: string) => void
  language: Language
  placeholder?: string
  className?: string
}

export function TimePicker({ time, onTimeChange, language, placeholder = "Select time", className }: TimePickerProps) {
  const [hours, setHours] = React.useState(time ? time.split(":")[0] : "09")
  const [minutes, setMinutes] = React.useState(time ? time.split(":")[1] : "00")

  const handleTimeChange = () => {
    const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`
    onTimeChange(formattedTime)
  }

  React.useEffect(() => {
    if (time) {
      const [h, m] = time.split(":")
      setHours(h)
      setMinutes(m)
    }
  }, [time])

  const displayTime = time ? formatTime(time, language) : placeholder

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !time && "text-muted-foreground", className)}
        >
          <Clock className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
          {displayTime}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align={language === "ar" ? "end" : "start"}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1">
              <Label htmlFor="hours">{language === "ar" ? "الساعة" : "Hours"}</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => {
                  const value = parseArabicInput(e.target.value)
                  setHours(value)
                }}
                onBlur={handleTimeChange}
                className="w-full"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="minutes">{language === "ar" ? "الدقيقة" : "Minutes"}</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                step="5"
                value={minutes}
                onChange={(e) => {
                  const value = parseArabicInput(e.target.value)
                  setMinutes(value)
                }}
                onBlur={handleTimeChange}
                className="w-full"
              />
            </div>
          </div>
          <Button onClick={handleTimeChange} size="sm">
            {language === "ar" ? "تأكيد" : "Confirm"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
