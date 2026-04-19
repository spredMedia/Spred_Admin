
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SendBulkMailToSpecificPage() {
  // TODO: Implement functionality to add multiple email recipients
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Send Bulk Mail to Specific Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="emails">Recipient Emails</label>
            <div className="flex space-x-2">
              <Input id="emails" placeholder="Enter email address" />
              <Button>Add Recipient</Button>
            </div>
            {/* TODO: Display list of recipients */}
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
