
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
import { AddContentTypeForm } from './add-content-type-form';
import { ContentTypesTable } from './content-types-table';
import { ContentType } from '@/lib/types';

// TODO: Replace with actual data fetching
const sampleContentTypes: ContentType[] = [
  {
    id: '1',
    name: 'Movie',
    description: 'Feature-length films.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Series',
    description: 'Episodic content with multiple seasons.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Short Clip',
    description: 'Short-form video content.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ContentTypesPage() {
  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Content Types</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Content Type</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a New Content Type</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <AddContentTypeForm />
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <ContentTypesTable contentTypes={sampleContentTypes} />
        </CardContent>
      </Card>
    </div>
  );
}
