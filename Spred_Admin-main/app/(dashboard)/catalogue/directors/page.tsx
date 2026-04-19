
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
import { AddDirectorForm } from './add-director-form';
import { DirectorsTable } from './directors-table';
import { Director } from '@/lib/types';

// TODO: Replace with actual data fetching
const sampleDirectors: Director[] = [
  {
    id: '1',
    name: 'Ava DuVernay',
    bio: 'An American filmmaker, television producer, and film distributor.',
    avatarUrl: 'https://example.com/ava.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Bong Joon-ho',
    bio: 'A South Korean film director, producer, and screenwriter.',
    avatarUrl: 'https://example.com/bong.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Greta Gerwig',
    bio: 'An American actress, writer, and director.',
    avatarUrl: 'https://example.com/greta.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function DirectorsPage() {
  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Directors</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Director</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a New Director</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <AddDirectorForm />
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <DirectorsTable directors={sampleDirectors} />
        </CardContent>
      </Card>
    </div>
  );
}
