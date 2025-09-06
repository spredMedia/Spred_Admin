
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResolutionsPage() {
  // TODO: Fetch and display resolutions
  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Resolutions</CardTitle>
          <Button>Add Resolution</Button>
        </CardHeader>
        <CardContent>
          {/* TODO: Implement a table or list to display resolutions */}
          <p>Resolution management interface will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
