
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
import { AddGenreForm } from './add-genre-form';

export default function GenresPage() {
  // TODO: Fetch and display genres
  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Genres</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Genre</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a New Genre</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <AddGenreForm />
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {/* TODO: Implement a table or list to display genres */}
          <p>Genre management interface will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
