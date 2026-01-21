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
import { Plus, Trash2, Tag } from "lucide-react";

const colorOptions = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
];

export default function CategoryManager({ 
  open, 
  onOpenChange, 
  categories, 
  onAdd, 
  onDelete 
}) {
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3B82F6' });

  const handleAdd = () => {
    if (newCategory.name.trim()) {
      onAdd(newCategory);
      setNewCategory({ name: '', color: '#3B82F6' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">Manage Categories</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          {/* Add new category */}
          <div className="space-y-3">
            <Label className="text-slate-700">Add New Category</Label>
            <div className="flex gap-2">
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Category name"
                className="border-slate-200"
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              />
              <Button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-600 shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setNewCategory(prev => ({ ...prev, color: color.value }))}
                  className={`w-8 h-8 rounded-full transition-all ${
                    newCategory.color === color.value ? 'ring-2 ring-offset-2 ring-slate-400' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Existing categories */}
          <div className="space-y-2">
            <Label className="text-slate-700">Your Categories</Label>
            {categories?.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No categories yet</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories?.map((category) => (
                  <div 
                    key={category.id} 
                    className="flex items-center justify-between bg-slate-50 px-3 py-2.5 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color || '#3B82F6' }}
                      />
                      <span className="text-sm text-slate-700">{category.name}</span>
                    </div>
                    <button
                      onClick={() => onDelete(category.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
