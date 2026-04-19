
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OriginalBitratesPage() {
  // TODO: Fetch and display original bitrates
  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Original Bitrates</CardTitle>
          <Button>Add Original Bitrate</Button>
        </CardHeader>
        <CardContent>
          {/* TODO: Implement a table or list to display original bitrates */}
          <p>Original bitrate management interface will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
