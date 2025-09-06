
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SendSingleMailAtAddressPage() {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Send Mail to Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email">Email Address</label>
            <Input id="email" type="email" placeholder="Enter email address" />
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
