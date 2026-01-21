import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CalendarIcon, 
  Plus, 
  X, 
  Target,
  BookOpen,
  Dumbbell,
  Brain,
  Heart,
  Utensils,
  Moon,
  Pencil
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";

const icons = [
  { name: 'target', icon: Target },
  { name: 'book', icon: BookOpen },
  { name: 'dumbbell', icon: Dumbbell },
  { name: 'brain', icon: Brain },
  { name: 'heart', icon: Heart },
  { name: 'utensils', icon: Utensils },
  { name: 'moon', icon: Moon },
  { name: 'pencil', icon: Pencil },
];

const frequencyOptions = [
  { value: 'daily', label: 'Every day' },
  { value: 'weekdays', label: 'Weekdays only' },
  { value: 'weekends', label: 'Weekends only' },
];

export default function CreateChallengeDialog({ open, onOpenChange, onSubmit, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    duration: 7,
    start_date: new Date(),
    end_date: addDays(new Date(), 6),
    frequency: 'daily',
    subtasks: [],
    reminder_enabled: false,
    reminder_time: '09:00',
    icon: 'target',
  });
  
  const [newSubtask, setNewSubtask] = useState('');

  const handleStartDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      start_date: date,
      end_date: addDays(date, prev.duration - 1)
    }));
  };

  const handleEndDateChange = (date) => {
    const newDuration = differenceInDays(date, formData.start_date) + 1;
    setFormData(prev => ({
      ...prev,
      end_date: date,
      duration: Math.max(1, newDuration)
    }));
  };

  const handleDurationChange = (value) => {
    const duration = parseInt(value) || 1;
    setFormData(prev => ({
      ...prev,
      duration,
      end_date: addDays(prev.start_date, duration - 1)
    }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, { id: Date.now().toString(), name: newSubtask.trim() }]
      }));
      setNewSubtask('');
    }
  };

  const removeSubtask = (id) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(s => s.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      start_date: format(formData.start_date, 'yyyy-MM-dd'),
      end_date: format(formData.end_date, 'yyyy-MM-dd'),
      status: 'active',
      current_streak: 0,
      best_streak: 0,
    });
    setFormData({
      name: '',
      description: '',
      category: '',
      duration: 7,
      start_date: new Date(),
      end_date: addDays(new Date(), 6),
      frequency: 'daily',
      subtasks: [],
      reminder_enabled: false,
      reminder_time: '09:00',
      icon: 'target',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">Create New Challenge</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Icon Selection */}
          <div className="space-y-2">
            <Label className="text-slate-700">Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {icons.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon: name }))}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    formData.icon === name 
                      ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-400' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">Challenge Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Morning Journaling"
              className="border-slate-200 focus:border-blue-300 focus:ring-blue-200"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700">Description (optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What's this challenge about?"
              className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 resize-none"
              rows={2}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-slate-700">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration & Dates */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-700">Duration</Label>
              <Input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => handleDurationChange(e.target.value)}
                className="border-slate-200"
              />
              <span className="text-xs text-slate-500">days</span>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-700">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal border-slate-200">
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    {format(formData.start_date, 'MMM d')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={handleStartDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-700">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal border-slate-200">
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    {format(formData.end_date, 'MMM d')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.end_date}
                    onSelect={handleEndDateChange}
                    disabled={(date) => date < formData.start_date}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label className="text-slate-700">Frequency</Label>
            <Select 
              value={formData.frequency} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
            >
              <SelectTrigger className="border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subtasks */}
          <div className="space-y-2">
            <Label className="text-slate-700">Daily Subtasks (optional)</Label>
            <p className="text-xs text-slate-500 mb-2">Add tasks that need to be completed each day</p>
            
            <div className="flex gap-2">
              <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="e.g., Write 3 pages"
                className="border-slate-200"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
              />
              <Button type="button" onClick={addSubtask} variant="outline" size="icon" className="shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {formData.subtasks.length > 0 && (
              <div className="space-y-2 mt-3">
                {formData.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-slate-700">{subtask.name}</span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(subtask.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reminder */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <Label className="text-slate-700">Daily Reminder</Label>
              <p className="text-xs text-slate-500 mt-0.5">Get notified to complete your challenge</p>
            </div>
            <Switch
              checked={formData.reminder_enabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, reminder_enabled: checked }))}
            />
          </div>

          {formData.reminder_enabled && (
            <div className="space-y-2">
              <Label className="text-slate-700">Reminder Time</Label>
              <Input
                type="time"
                value={formData.reminder_time}
                onChange={(e) => setFormData(prev => ({ ...prev, reminder_time: e.target.value }))}
                className="border-slate-200"
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            disabled={!formData.name}
          >
            Create Challenge
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
