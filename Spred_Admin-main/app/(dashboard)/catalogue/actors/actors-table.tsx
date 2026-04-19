
'use client';

import { Actor } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ActorsTableProps {
  actors: Actor[];
}

export function ActorsTable({ actors }: ActorsTableProps) {
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
        {actors.map((actor) => (
          <TableRow key={actor.id}>
            <TableCell>{actor.name}</TableCell>
            <TableCell>{actor.bio}</TableCell>
            <TableCell>{new Date(actor.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
