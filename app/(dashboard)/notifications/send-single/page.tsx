
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SendSingleMailPage() {
  // TODO: Fetch and display users for selection
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Send Single Mail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* TODO: Implement user selection dropdown */}
          <div className="space-y-2">
            <label htmlFor="user">Select User</label>
            <Input id="user" placeholder="Search and select a user" />
          </div>
          <div className="space-y-2">
            <label htmlFor="subject">Subject</label>
            <Input id="subject" placeholder="Enter email subject" />
          </div>
          <div className="space-y-2">
            <label htmlFor="message">Message</label>
            <Textarea id="message" placeholder="Enter your message" />
          </div>
          <Button>Send Mail</Button>
        </CardContent>
      </Card>
    </div>
  );
}
