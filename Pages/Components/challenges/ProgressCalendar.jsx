import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, X } from "lucide-react";
import { format, eachDayOfInterval, isSameDay, isAfter, isBefore, isToday } from "date-fns";
import { motion } from "framer-motion";

export default function ProgressCalendar({ challenge, dailyLogs }) {
  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  const today = new Date();
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  const getLogForDay = (date) => {
    return dailyLogs.find(log => isSameDay(new Date(log.date), date));
  };
  
  const getDayStatus = (date) => {
    const log = getLogForDay(date);
    if (log?.completed) return 'completed';
    if (isAfter(date, today)) return 'future';
    if (isSameDay(date, today)) return 'today';
    return 'missed';
  };

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-800">Progress Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-slate-400 pb-2">
              {day}
            </div>
          ))}
          
          {/* Add empty cells for alignment */}
          {Array.from({ length: startDate.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          
          {days.map((date, index) => {
            const status = getDayStatus(date);
            return (
              <motion.div
                key={date.toISOString()}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center text-xs
                  ${status === 'completed' ? 'bg-emerald-100 text-emerald-700' : ''}
                  ${status === 'today' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300' : ''}
                  ${status === 'missed' ? 'bg-red-50 text-red-400' : ''}
                  ${status === 'future' ? 'bg-slate-50 text-slate-400' : ''}
                `}
              >
                <span className="font-medium">{format(date, 'd')}</span>
                {status === 'completed' && <CheckCircle2 className="w-3 h-3 mt-0.5" />}
                {status === 'missed' && <X className="w-3 h-3 mt-0.5" />}
                {status === 'today' && <Circle className="w-3 h-3 mt-0.5" />}
              </motion.div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="w-3 h-3 rounded bg-emerald-100" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="w-3 h-3 rounded bg-blue-100 ring-1 ring-blue-300" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="w-3 h-3 rounded bg-red-50" />
            <span>Missed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
