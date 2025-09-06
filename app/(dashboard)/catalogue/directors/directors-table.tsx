
'use client';

import { Director } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DirectorsTableProps {
  directors: Director[];
}

export function DirectorsTable({ directors }: DirectorsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Bio</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {directors.map((director) => (
          <TableRow key={director.id}>
            <TableCell>{director.name}</TableCell>
            <TableCell>{director.bio}</TableCell>
            <TableCell>{new Date(director.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
