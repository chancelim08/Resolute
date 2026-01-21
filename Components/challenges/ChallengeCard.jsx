import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Flame, 
  Calendar, 
  CheckCircle2, 
  Circle,
  Target,
  BookOpen,
  Dumbbell,
  Brain,
  Heart,
  Utensils,
  Moon,
  Pencil
} from "lucide-react";
import { format, differenceInDays, isAfter, isBefore, isToday } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

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

export default function ChallengeCard({ challenge, dailyLogs, categories }) {
  const Icon = iconMap[challenge.icon] || Target;
  
  const today = new Date();
  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const completedDays = dailyLogs.filter(log => log.completed).length;
  const progress = Math.round((completedDays / totalDays) * 100);
  
  const isActive = !isBefore(today, startDate) && !isAfter(today, endDate);
  const hasStarted = !isBefore(today, startDate);
  const hasEnded = isAfter(today, endDate);
  
  const category = categories?.find(c => c.name === challenge.category);
  
  const daysRemaining = hasEnded ? 0 : Math.max(0, differenceInDays(endDate, today) + 1);

  return (
    <Link to={createPageUrl(`ChallengeDetail?id=${challenge.id}`)}>
      <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-slate-200/60 hover:border-blue-200 cursor-pointer overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {challenge.name}
                </h3>
                {category && (
                  <Badge variant="secondary" className="mt-1 text-xs bg-slate-100 text-slate-600 font-normal">
                    {category.name}
                  </Badge>
                )}
              </div>
            </div>
            
            {challenge.current_streak > 0 && (
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-medium">{challenge.current_streak}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Progress</span>
              <span className="font-medium text-slate-700">{completedDays}/{totalDays} days</span>
            </div>
            
            <Progress value={progress} className="h-2 bg-slate-100" />
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{daysRemaining} days left</span>
              </div>
              
              {challenge.status === 'completed' ? (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              ) : isActive ? (
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  Active
                </Badge>
              ) : hasEnded ? (
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                  Ended
                </Badge>
              ) : (
                <Badge variant="outline" className="border-slate-200 text-slate-500">
                  Starts {format(startDate, 'MMM d')}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
