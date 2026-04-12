import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X, Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface CreateRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRule: (rule: {
    name: string;
    conditionType: 'all' | 'any';
    conditions: Condition[];
    actionType: string;
    actionValue: string;
    active: boolean;
  }) => void;
}

export function CreateRuleDialog({ open, onOpenChange, onCreateRule }: CreateRuleDialogProps) {
  const [ruleName, setRuleName] = useState('');
  const [conditionType, setConditionType] = useState<'all' | 'any'>('all');
  const [conditions, setConditions] = useState<Condition[]>([
    { id: '1', field: '', operator: '', value: '' }
  ]);
  const [actionType, setActionType] = useState('');
  const [actionValue, setActionValue] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      field: '',
      operator: '',
      value: ''
    };
    setConditions([...conditions, newCondition]);
  };

  const handleRemoveCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter(c => c.id !== id));
    }
  };

  const handleConditionChange = (id: string, key: keyof Condition, value: string) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, [key]: value } : c
    ));
  };

  const handleCreate = () => {
    onCreateRule({
      name: ruleName,
      conditionType,
      conditions,
      actionType,
      actionValue,
      active: isActive
    });
    // Reset form
    setRuleName('');
    setConditionType('all');
    setConditions([{ id: '1', field: '', operator: '', value: '' }]);
    setActionType('');
    setActionValue('');
    setIsActive(true);
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center" 
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 50 
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-lg" 
        style={{ 
          width: '600px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--foreground)'
          }}>
            Create New Rule
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="hover:bg-gray-100 rounded p-1"
          >
            <X className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rule Name */}
          <div>
            <label style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--foreground)',
              display: 'block',
              marginBottom: '8px'
            }}>
              Rule Name*
            </label>
            <Input
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="Input Rule Name"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CED4DA'
              }}
            />
          </div>

          {/* Conditions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                Conditions
              </label>
              <button
                onClick={handleAddCondition}
                className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--primary)'
                }}
              >
                <Plus className="w-4 h-4" />
                Add Condition
              </button>
            </div>

            {/* Condition Type Selector */}
            <div className="flex items-center gap-2 mb-4">
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)'
              }}>
                Match
              </span>
              <Select value={conditionType} onValueChange={(value: 'all' | 'any') => setConditionType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ALL</SelectItem>
                  <SelectItem value="any">ANY</SelectItem>
                </SelectContent>
              </Select>
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)'
              }}>
                of the following conditions:
              </span>
            </div>

            {/* Conditions List */}
            <div className="space-y-3">
              {conditions.map((condition, index) => (
                <div key={condition.id} className="flex items-center gap-2">
                  <Select 
                    value={condition.field} 
                    onValueChange={(value) => handleConditionChange(condition.id, 'field', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="source">Source</SelectItem>
                      <SelectItem value="tag">Tag</SelectItem>
                      <SelectItem value="risk_level">Risk Level</SelectItem>
                      <SelectItem value="age">Age</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={condition.operator} 
                    onValueChange={(value) => handleConditionChange(condition.id, 'operator', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="not_equals">Not Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="greater_than">Greater Than</SelectItem>
                      <SelectItem value="less_than">Less Than</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    value={condition.value}
                    onChange={(e) => handleConditionChange(condition.id, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CED4DA'
                    }}
                  />

                  <button
                    onClick={() => handleRemoveCondition(condition.id)}
                    disabled={conditions.length === 1}
                    className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Section */}
          <div>
            <label style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--foreground)',
              fontWeight: 'var(--font-weight-medium)',
              display: 'block',
              marginBottom: '12px'
            }}>
              Action
            </label>

            <div className="space-y-3">
              <div>
                <label style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Action Type*
                </label>
                <Select value={actionType} onValueChange={setActionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Action Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assign_tag">Assign Tag</SelectItem>
                    <SelectItem value="update_status">Update Status</SelectItem>
                    <SelectItem value="assign_to">Assign To</SelectItem>
                    <SelectItem value="send_notification">Send Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Value*
                </label>
                <Input
                  value={actionValue}
                  onChange={(e) => setActionValue(e.target.value)}
                  placeholder="Input Value"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CED4DA'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Activate Rule Toggle */}
          <div className="flex items-center justify-between p-4 rounded" style={{ backgroundColor: '#F9FAFB' }}>
            <div>
              <div style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--foreground)',
                marginBottom: '4px'
              }}>
                Activate Rule
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)'
              }}>
                Enable this rule to start applying it to prospects
              </div>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!ruleName || !actionType || !actionValue}
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'var(--primary-foreground)' 
            }}
            className="hover:opacity-90"
          >
            Create Rule
          </Button>
        </div>
      </div>
    </div>
  );
}
