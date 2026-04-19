
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
import { AddActorForm } from './add-actor-form';
import { ActorsTable } from './actors-table';
import { Actor } from '@/lib/types';

// TODO: Replace with actual data fetching
const sampleActors: Actor[] = [
  {
    id: '1',
    name: 'Viola Davis',
    bio: 'An American actress and producer.',
    avatarUrl: 'https://example.com/viola.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Chadwick Boseman',
    bio: 'An American actor.',
    avatarUrl: 'https://example.com/chadwick.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Lupita Nyong\'o',
    bio: 'A Kenyan-Mexican actress.',
    avatarUrl: 'https://example.com/lupita.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ActorsPage() {
  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Actors</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Actor</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a New Actor</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <AddActorForm />
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <ActorsTable actors={sampleActors} />
        </CardContent>
      </Card>
    </div>
  );
}
