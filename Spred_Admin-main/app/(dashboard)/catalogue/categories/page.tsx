
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddCategoryForm } from './add-category-form';
import { CategoriesTable } from './categories-table';
import { Category } from '@/lib/types';

// TODO: Replace with actual data fetching
const sampleCategories: Category[] = [
  {
    id: '1',
    name: 'Entertainment',
    description: 'Movies, series, and clips for fun.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Education',
    description: 'Documentaries and learning materials.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Music Videos',
    description: 'Latest hits and classic music videos.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function CategoriesPage() {
  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Categories</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Category</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a New Category</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <AddCategoryForm />
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <CategoriesTable categories={sampleCategories} />
        </CardContent>
      </Card>
    </div>
  );
}
