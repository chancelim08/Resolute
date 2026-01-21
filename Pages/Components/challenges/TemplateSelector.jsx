import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target,
  BookOpen,
  Dumbbell,
  Brain,
  Heart,
  Utensils,
  Moon,
  Pencil,
  ArrowRight
} from "lucide-react";

const templates = [
  {
    name: "Morning Journaling",
    description: "Start your day with mindful reflection",
    duration: 7,
    category: "Mindfulness",
    icon: "pencil",
    subtasks: [
      { id: "1", name: "Write 3 things you're grateful for" },
      { id: "2", name: "Set intention for the day" },
    ]
  },
  {
    name: "Gym Challenge",
    description: "Build your fitness habit",
    duration: 14,
    category: "Fitness",
    icon: "dumbbell",
    subtasks: [
      { id: "1", name: "Complete workout" },
      { id: "2", name: "Stretch for 5 minutes" },
    ]
  },
  {
    name: "Reading Sprint",
    description: "Read every day for a week",
    duration: 7,
    category: "Learning",
    icon: "book",
    subtasks: [
      { id: "1", name: "Read for 20 minutes" },
    ]
  },
  {
    name: "Meditation Journey",
    description: "Cultivate inner peace",
    duration: 21,
    category: "Mindfulness",
    icon: "brain",
    subtasks: [
      { id: "1", name: "Meditate for 10 minutes" },
    ]
  },
  {
    name: "Healthy Eating",
    description: "Make better food choices",
    duration: 14,
    category: "Health",
    icon: "utensils",
    subtasks: [
      { id: "1", name: "Eat a healthy breakfast" },
      { id: "2", name: "Drink 8 glasses of water" },
      { id: "3", name: "No processed snacks" },
    ]
  },
  {
    name: "Sleep Better",
    description: "Improve your sleep quality",
    duration: 7,
    category: "Health",
    icon: "moon",
    subtasks: [
      { id: "1", name: "No screens 1 hour before bed" },
      { id: "2", name: "In bed by 10pm" },
    ]
  },
];

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

export default function TemplateSelector({ open, onOpenChange, onSelect }) {
  const handleSelect = (template) => {
    onSelect(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">Choose a Template</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {templates.map((template, index) => {
            const Icon = iconMap[template.icon] || Target;
            return (
              <Card 
                key={index}
                className="cursor-pointer group hover:shadow-md hover:border-blue-200 transition-all border-slate-200"
                onClick={() => handleSelect(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <Icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{template.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                          {template.duration} days
                        </Badge>
                        {template.subtasks.length > 0 && (
                          <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                            {template.subtasks.length} subtasks
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
