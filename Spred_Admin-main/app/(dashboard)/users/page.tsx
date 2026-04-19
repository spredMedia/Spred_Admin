
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UsersPage() {
  // TODO: Fetch and display users
  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Button>Add User</Button>
        </CardHeader>
        <CardContent>
          {/* TODO: Implement a table or list to display users */}
          <p>User management interface will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
