import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Circle, Undo2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DailyCheckIn({ 
  challenge, 
  todayLog, 
  onToggleComplete, 
  onToggleSubtask 
}) {
  const hasSubtasks = challenge.subtasks && challenge.subtasks.length > 0;
  const completedSubtasks = todayLog?.completed_subtasks || [];
  const allSubtasksComplete = hasSubtasks 
    ? challenge.subtasks.every(s => completedSubtasks.includes(s.id))
    : true;
  
  const isComplete = todayLog?.completed || false;

  const handleMainToggle = () => {
    if (hasSubtasks && !allSubtasksComplete && !isComplete) {
      // Can't mark complete without subtasks
      return;
    }
    onToggleComplete(!isComplete);
  };

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-800">Today's Check-in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasSubtasks && (
          <div className="space-y-2">
            <p className="text-sm text-slate-500 mb-3">Complete all subtasks to mark the day as done</p>
            {challenge.subtasks.map((subtask) => {
              const isChecked = completedSubtasks.includes(subtask.id);
              return (
                <motion.div
                  key={subtask.id}
                  initial={false}
                  animate={{ opacity: 1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isChecked ? 'bg-blue-50' : 'bg-slate-50'
                  }`}
                >
                  <Checkbox
                    id={subtask.id}
                    checked={isChecked}
                    onCheckedChange={() => onToggleSubtask(subtask.id)}
                    className="border-slate-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <label
                    htmlFor={subtask.id}
                    className={`flex-1 text-sm cursor-pointer transition-all ${
                      isChecked ? 'text-slate-500 line-through' : 'text-slate-700'
                    }`}
                  >
                    {subtask.name}
                  </label>
                  <AnimatePresence>
                    {isChecked && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        <Button
          onClick={handleMainToggle}
          disabled={hasSubtasks && !allSubtasksComplete && !isComplete}
          className={`w-full h-12 transition-all duration-300 ${
            isComplete 
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
              : hasSubtasks && !allSubtasksComplete
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Completed! Tap to Undo
              </motion.div>
            ) : (
              <motion.div
                key="incomplete"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <Circle className="w-5 h-5" />
                Mark Today as Complete
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {hasSubtasks && !allSubtasksComplete && !isComplete && (
          <p className="text-xs text-center text-slate-400">
            Complete all {challenge.subtasks.length - completedSubtasks.length} remaining subtask(s) first
          </p>
        )}
      </CardContent>
    </Card>
  );
}
