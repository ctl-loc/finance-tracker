"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";

export function DatePickerComponent({
    date,
    setter,
}: {
    date: Date | undefined;
    setter: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) {
    return (
        <div className="flex flex-col">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        data-empty={!date}
                        className="justify-start text-left font-normal"
                    >
                        <CalendarIcon color={date ? "#01a52b" : undefined} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                            // set date if it is in the past
                            if (date && date > new Date()) return;
                            setter(date);
                        }}
                        required={false}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
