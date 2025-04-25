"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("rdp", className)}
      classNames={{
        months: "rdp-months flex space-x-4",
        month: "rdp-month",
        caption: "rdp-caption flex items-center justify-center relative pt-1",
        caption_label: "rdp-caption_label text-sm font-medium px-8",
        nav: "rdp-nav space-x-1 flex items-center",
        nav_button: cn(
          "rdp-nav_button h-7 w-7 bg-transparent p-0 hover:bg-accent rounded-md border border-input"
        ),
        nav_button_previous: "rdp-nav_button_previous absolute left-1",
        nav_button_next: "rdp-nav_button_next absolute right-1",
        table: "rdp-table w-full border-collapse space-y-1",
        head_row: "rdp-head_row",
        head_cell:
          "rdp-head_cell text-muted-foreground font-medium text-[0.8rem] py-2 text-center",
        row: "rdp-row",
        cell: "rdp-cell relative p-0 text-center focus-within:relative focus-within:z-20",
        day: "rdp-day inline-flex items-center justify-center text-sm transition-colors hover:bg-accent hover:text-accent-foreground rounded-full h-9 w-9 p-0 font-normal",
        day_selected: "rdp-day_selected",
        day_today: "rdp-day_today",
        day_outside: "rdp-day_outside text-muted-foreground opacity-50",
        day_disabled: "rdp-day_disabled text-muted-foreground opacity-50",
        day_range_middle: "rdp-day_range_middle",
        day_hidden: "rdp-day_hidden invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
