import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Bell, Clock, User, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const { data: settings } = useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const results = await base44.entities.UserSettings.list();
      return results[0] || { default_reminder_time: '09:00', theme: 'light' };
    },
    enabled: isAuthenticated,
  });

  const [formData, setFormData] = useState({
    default_reminder_time: '09:00',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        default_reminder_time: settings.default_reminder_time || '09:00',
      });
    }
  }, [settings]);

  const saveSettingsMutation = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
        return base44.entities.UserSettings.update(settings.id, data);
      } else {
        return base44.entities.UserSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
  });

  const handleSave = () => {
    saveSettingsMutation.mutate(formData);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Sign in required</h2>
            <p className="text-slate-500 mb-4">Please log in to access your settings</p>
            <Button 
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Log in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
            <p className="text-slate-500 text-sm">Customize your experience</p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Profile
                </CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-700">Name</Label>
                  <Input 
                    value={user?.full_name || ''} 
                    disabled 
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Email</Label>
                  <Input 
                    value={user?.email || ''} 
                    disabled 
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-500" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage your reminder preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-700">Default Reminder Time</Label>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <Input
                      type="time"
                      value={formData.default_reminder_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, default_reminder_time: e.target.value }))}
                      className="w-32 border-slate-200"
                    />
                  </div>
                  <p className="text-xs text-slate-400">This will be the default time for new challenge reminders</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              onClick={handleSave}
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={saveSettingsMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {saveSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
