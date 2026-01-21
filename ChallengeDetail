import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  ArrowLeft, 
  Flame, 
  Calendar, 
  Target,
  BookOpen,
  Dumbbell,
  Brain,
  Heart,
  Utensils,
  Moon,
  Pencil,
  Trash2,
  Trophy,
  Clock
} from "lucide-react";
import { format, differenceInDays, isToday, isSameDay, isAfter, isBefore } from "date-fns";
import { motion } from "framer-motion";
import DailyCheckIn from "@/components/challenges/DailyCheckIn";
import ProgressCalendar from "@/components/challenges/ProgressCalendar";

const iconMap = {
  target: Target,
  book: BookOpen,
  dumbbell: Dumbbell,
  brain: Brain,
  heart: Heart,
  utensils: Utensils,
  moon: Moon,
  pencil: Pencil,
};

export default function ChallengeDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const challengeId = urlParams.get('id');
  
  const queryClient = useQueryClient();

  const { data: challenge, isLoading } = useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: async () => {
      const challenges = await base44.entities.Challenge.filter({ id: challengeId });
      return challenges[0];
    },
    enabled: !!challengeId,
  });

  const { data: dailyLogs = [] } = useQuery({
    queryKey: ['dailyLogs', challengeId],
    queryFn: async () => {
      return await base44.entities.DailyLog.filter({ challenge_id: challengeId });
    },
    enabled: !!challengeId,
  });

  const createLogMutation = useMutation({
    mutationFn: (data) => base44.entities.DailyLog.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dailyLogs', challengeId] }),
  });

  const updateLogMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.DailyLog.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dailyLogs', challengeId] }),
  });

  const updateChallengeMutation = useMutation({
    mutationFn: (data) => base44.entities.Challenge.update(challengeId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['challenge', challengeId] }),
  });

  const deleteChallengeMutation = useMutation({
    mutationFn: () => base44.entities.Challenge.delete(challengeId),
    onSuccess: () => {
      window.location.href = createPageUrl('Home');
    },
  });

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayLog = dailyLogs.find(log => log.date === todayStr);

  const handleToggleComplete = async (completed) => {
    if (todayLog) {
      await updateLogMutation.mutateAsync({ 
        id: todayLog.id, 
        data: { completed } 
      });
    } else {
      await createLogMutation.mutateAsync({
        challenge_id: challengeId,
        date: todayStr,
        completed,
        completed_subtasks: [],
      });
    }
    
    // Update streak
    const newStreak = completed 
      ? (challenge.current_streak || 0) + 1 
      : Math.max(0, (challenge.current_streak || 0) - 1);
    const bestStreak = Math.max(newStreak, challenge.best_streak || 0);
    
    await updateChallengeMutation.mutateAsync({
      current_streak: newStreak,
      best_streak: bestStreak,
    });
  };

  const handleToggleSubtask = async (subtaskId) => {
    const currentCompleted = todayLog?.completed_subtasks || [];
    const newCompleted = currentCompleted.includes(subtaskId)
      ? currentCompleted.filter(id => id !== subtaskId)
      : [...currentCompleted, subtaskId];
    
    if (todayLog) {
      await updateLogMutation.mutateAsync({
        id: todayLog.id,
        data: { completed_subtasks: newCompleted }
      });
    } else {
      await createLogMutation.mutateAsync({
        challenge_id: challengeId,
        date: todayStr,
        completed: false,
        completed_subtasks: newCompleted,
      });
    }
  };

  if (isLoading || !challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  const Icon = iconMap[challenge.icon] || Target;
  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  const today = new Date();
  
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const completedDays = dailyLogs.filter(log => log.completed).length;
  const progress = Math.round((completedDays / totalDays) * 100);
  
  const isActive = !isBefore(today, startDate) && !isAfter(today, endDate);
  const daysRemaining = Math.max(0, differenceInDays(endDate, today) + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                <Trash2 className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Challenge?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this challenge and all its progress. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteChallengeMutation.mutate()}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        {/* Challenge Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <Icon className="w-7 h-7 text-blue-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800">{challenge.name}</h1>
              {challenge.description && (
                <p className="text-slate-500 mt-1">{challenge.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {challenge.category && (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                    {challenge.category}
                  </Badge>
                )}
                {isActive ? (
                  <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                ) : (
                  <Badge variant="secondary">{daysRemaining > 0 ? 'Upcoming' : 'Ended'}</Badge>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <Card className="border-slate-200 bg-white/70">
            <CardContent className="p-4 text-center">
              <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">{challenge.current_streak || 0}</p>
              <p className="text-xs text-slate-500">Current Streak</p>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 bg-white/70">
            <CardContent className="p-4 text-center">
              <Trophy className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">{challenge.best_streak || 0}</p>
              <p className="text-xs text-slate-500">Best Streak</p>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 bg-white/70">
            <CardContent className="p-4 text-center">
              <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">{daysRemaining}</p>
              <p className="text-xs text-slate-500">Days Left</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Check-in */}
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <DailyCheckIn
              challenge={challenge}
              todayLog={todayLog}
              onToggleComplete={handleToggleComplete}
              onToggleSubtask={handleToggleSubtask}
            />
          </motion.div>
        )}

        {/* Progress Calendar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ProgressCalendar challenge={challenge} dailyLogs={dailyLogs} />
        </motion.div>

        {/* Challenge Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card className="border-slate-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-800">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Duration</span>
                <span className="text-slate-700 font-medium">{totalDays} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Start Date</span>
                <span className="text-slate-700 font-medium">{format(startDate, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">End Date</span>
                <span className="text-slate-700 font-medium">{format(endDate, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Frequency</span>
                <span className="text-slate-700 font-medium capitalize">{challenge.frequency || 'Daily'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Completed</span>
                <span className="text-slate-700 font-medium">{completedDays} / {totalDays} days ({progress}%)</span>
              </div>
              {challenge.subtasks && challenge.subtasks.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtasks</span>
                  <span className="text-slate-700 font-medium">{challenge.subtasks.length} per day</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
