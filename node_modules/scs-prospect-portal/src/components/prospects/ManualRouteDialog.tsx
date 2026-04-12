import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ManualRouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prospectName?: string;
}

export function ManualRouteDialog({ open, onOpenChange, prospectName = 'John Tan' }: ManualRouteDialogProps) {
  const [routedTo, setRoutedTo] = useState('');
  const [routingType, setRoutingType] = useState('');
  const [routingReason, setRoutingReason] = useState('');
  const [routingUrgency, setRoutingUrgency] = useState('');
  const [routingStatus, setRoutingStatus] = useState('');

  const handleSave = () => {
    // Save routing logic would go here
    console.log('Routing saved:', {
      routedTo,
      routingType,
      routingReason,
      routingUrgency,
      routingStatus
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form
    setRoutedTo('');
    setRoutingType('');
    setRoutingReason('');
    setRoutingUrgency('');
    setRoutingStatus('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-md"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB'
        }}
      >
        <DialogHeader>
          <DialogTitle 
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: '#111827'
            }}
          >
            Manual Route
          </DialogTitle>
          <DialogDescription
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: '#6B7280'
            }}
          >
            Manually route the prospect {prospectName} to a specific assignee and set the routing details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Routed To */}
          <div>
            <Label 
              htmlFor="routed-to"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: '#374151',
                marginBottom: '6px',
                display: 'block'
              }}
            >
              Routed To
            </Label>
            <Select value={routedTo} onValueChange={setRoutedTo}>
              <SelectTrigger 
                id="routed-to"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#CED4DA',
                  color: routedTo ? '#272B30' : '#4F575E',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  height: '40px'
                }}
              >
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sarah-lim">Sarah Lim</SelectItem>
                <SelectItem value="michael-wong">Michael Wong</SelectItem>
                <SelectItem value="jessica-tan">Jessica Tan</SelectItem>
                <SelectItem value="david-chen">David Chen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Routing Type */}
          <div>
            <Label 
              htmlFor="routing-type"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: '#374151',
                marginBottom: '6px',
                display: 'block'
              }}
            >
              Routing Type
            </Label>
            <Select value={routingType} onValueChange={setRoutingType}>
              <SelectTrigger 
                id="routing-type"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#CED4DA',
                  color: routingType ? '#272B30' : '#4F575E',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  height: '40px'
                }}
              >
                <SelectValue placeholder="Select routing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Direct Assignment</SelectItem>
                <SelectItem value="round-robin">Round Robin</SelectItem>
                <SelectItem value="load-balanced">Load Balanced</SelectItem>
                <SelectItem value="territory">Territory Based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Routing Reason */}
          <div>
            <Label 
              htmlFor="routing-reason"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: '#374151',
                marginBottom: '6px',
                display: 'block'
              }}
            >
              Routing Reason
            </Label>
            <Select value={routingReason} onValueChange={setRoutingReason}>
              <SelectTrigger 
                id="routing-reason"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#CED4DA',
                  color: routingReason ? '#272B30' : '#4F575E',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  height: '40px'
                }}
              >
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-prospect">New Prospect</SelectItem>
                <SelectItem value="follow-up">Follow-up Required</SelectItem>
                <SelectItem value="high-priority">High Priority</SelectItem>
                <SelectItem value="specialist-required">Specialist Required</SelectItem>
                <SelectItem value="reassignment">Reassignment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Routing Urgency */}
          <div>
            <Label 
              htmlFor="routing-urgency"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: '#374151',
                marginBottom: '6px',
                display: 'block'
              }}
            >
              Routing Urgency
            </Label>
            <Select value={routingUrgency} onValueChange={setRoutingUrgency}>
              <SelectTrigger 
                id="routing-urgency"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#CED4DA',
                  color: routingUrgency ? '#272B30' : '#4F575E',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  height: '40px'
                }}
              >
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Routing Status */}
          <div>
            <Label 
              htmlFor="routing-status"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: '#374151',
                marginBottom: '6px',
                display: 'block'
              }}
            >
              Routing Status
            </Label>
            <Select value={routingStatus} onValueChange={setRoutingStatus}>
              <SelectTrigger 
                id="routing-status"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#CED4DA',
                  color: routingStatus ? '#272B30' : '#4F575E',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  height: '40px'
                }}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
            style={{
              borderColor: '#CED4DA',
              color: '#374151',
              backgroundColor: 'white',
              height: '40px',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              height: '40px',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}