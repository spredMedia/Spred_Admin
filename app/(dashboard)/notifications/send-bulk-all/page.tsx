
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export default function SendBulkMailToAllPage() {
  // TODO: Fetch and display all users with checkboxes
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Send Bulk Mail to All Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label>Select Users</label>
            <div className="flex items-center space-x-2">
              <Checkbox id="select-all" />
              <label htmlFor="select-all">Select All</label>
            </div>
            {/* TODO: Display a list of users with checkboxes */}
            <div className="border rounded-md p-4 h-64 overflow-y-auto">
              <p>User list with checkboxes will be here.</p>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="subject">Subject</label>
            <Input id="subject" placeholder="Enter email subject" />
          </div>
          <div className="space-y-2">
            <label htmlFor="message">Message</label>
            <Textarea id="message" placeholder="Enter your message" />
          </div>
          <Button>Send Bulk Mail</Button>
        </CardContent>
      </Card>
    </div>
  );
}
