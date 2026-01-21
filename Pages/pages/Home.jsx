import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Plus, LayoutTemplate, Flame, Target, CheckCircle2, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isToday, isSameDay } from "date-fns";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import CreateChallengeDialog from "@/components/challenges/CreateChallengeDialog";
import TemplateSelector from "@/components/challenges/TemplateSelector";
import CategoryManager from "@/components/categories/CategoryManager";
import { addDays } from "date-fns";

export default function Home() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: challenges = [], isLoading: loadingChallenges } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => base44.entities.Challenge.list('-created_date'),
  });

  const { data: dailyLogs = [] } = useQuery({
    queryKey: ['dailyLogs'],
    queryFn: () => base44.entities.DailyLog.list(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list(),
  });

  const createChallengeMutation = useMutation({
    mutationFn: (data) => base44.entities.Challenge.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      setShowCreateDialog(false);
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data) => base44.entities.Category.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => base44.entities.Category.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowTemplates(false);
    setShowCreateDialog(true);
  };

  const handleCreateChallenge = (data) => {
    createChallengeMutation.mutate(data);
  };

  // Calculate stats
  const activeChallenges = challenges.filter(c => c.status === 'active');
  const todayLogs = dailyLogs.filter(log => isToday(new Date(log.date)) && log.completed);
  const totalStreak = challenges.reduce((sum, c) => sum + (c.current_streak || 0), 0);
  const completedChallenges = challenges.filter(c => c.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800">Resolute</h1>
          <p className="text-slate-500 mt-1">Build habits through focused challenges</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Target className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Active</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{activeChallenges.length}</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60">
            <div className="flex items-center gap-2 text-amber-500 mb-2">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Streak</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{totalStreak}</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60">
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Today</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{todayLogs.length}</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60">
            <div className="flex items-center gap-2 text-purple-500 mb-2">
              <Target className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Done</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{completedChallenges}</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Challenge
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setShowTemplates(true)}
            className="border-slate-200 hover:bg-slate-50"
          >
            <LayoutTemplate className="w-4 h-4 mr-2" />
            Templates
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setShowCategories(true)}
            className="border-slate-200 hover:bg-slate-50"
          >
            <Tag className="w-4 h-4 mr-2" />
            Categories
          </Button>
        </motion.div>

        {/* Challenges List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Your Challenges</h2>
          
          {loadingChallenges ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : challenges.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-slate-200"
            >
              <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No challenges yet</h3>
              <p className="text-slate-400 mb-4">Start your first challenge to build better habits</p>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Challenge
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <AnimatePresence>
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ChallengeCard 
                      challenge={challenge} 
                      dailyLogs={dailyLogs.filter(log => log.challenge_id === challenge.id)}
                      categories={categories}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CreateChallengeDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateChallenge}
        categories={categories}
        initialData={selectedTemplate ? {
          ...selectedTemplate,
          start_date: new Date(),
          end_date: addDays(new Date(), selectedTemplate.duration - 1),
        } : null}
      />

      <TemplateSelector
        open={showTemplates}
        onOpenChange={setShowTemplates}
        onSelect={handleTemplateSelect}
      />

      <CategoryManager
        open={showCategories}
        onOpenChange={setShowCategories}
        categories={categories}
        onAdd={(data) => createCategoryMutation.mutate(data)}
        onDelete={(id) => deleteCategoryMutation.mutate(id)}
      />
    </div>
  );
}
