
'use client';

import { Genre } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface GenresTableProps {
  genres: Genre[];
}

export function GenresTable({ genres }: GenresTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {genres.map((genre) => (
          <TableRow key={genre.id}>
            <TableCell>{genre.name}</TableCell>
            <TableCell>{new Date(genre.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
