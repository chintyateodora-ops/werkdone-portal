import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Plus, ChevronDown, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { Footer } from '../Footer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import { CreateRuleDialog } from './CreateRuleDialog';

const mockTags = [
  {
    id: 1,
    name: 'Low Risk',
    category: 'Risk',
    active: true,
    color: '#D1FAE5',
    textColor: '#059669',
    borderColor: '#A7F3D0'
  },
  {
    id: 2,
    name: 'Medium Risk',
    category: 'Risk',
    active: true,
    color: '#FEF3C7',
    textColor: '#92400E',
    borderColor: '#FDE68A'
  },
  {
    id: 3,
    name: 'High Risk',
    category: 'Risk',
    active: true,
    color: '#FEE2E2',
    textColor: '#DC2626',
    borderColor: '#FECACA'
  },
  {
    id: 4,
    name: 'No Risk',
    category: 'Risk',
    active: true,
    color: '#F3F4F6',
    textColor: '#374151',
    borderColor: '#E5E7EB'
  },
  {
    id: 5,
    name: 'Screening',
    category: 'Screening Stage',
    active: true,
    color: '#F3F4F6',
    textColor: '#374151',
    borderColor: '#E5E7EB'
  },
  {
    id: 6,
    name: 'Waiting Result',
    category: 'Screening Stage',
    active: true,
    color: '#F3F4F6',
    textColor: '#374151',
    borderColor: '#E5E7EB'
  },
  {
    id: 7,
    name: 'PAP Test',
    category: 'Screening Stage',
    active: true,
    color: '#F3F4F6',
    textColor: '#374151',
    borderColor: '#E5E7EB'
  },
  {
    id: 8,
    name: 'Abnormal / Follow-up Required',
    category: 'Screening Stage',
    active: true,
    color: '#F3F4F6',
    textColor: '#374151',
    borderColor: '#E5E7EB'
  },
];

const mockCategories = [
  {
    id: 1,
    name: 'Screening Stage',
    tags: [
      { name: 'Screening', color: '#F3F4F6', textColor: '#374151', borderColor: '#E5E7EB' },
      { name: 'Waiting Result', color: '#F3F4F6', textColor: '#374151', borderColor: '#E5E7EB' },
      { name: 'PAP Test', color: '#F3F4F6', textColor: '#374151', borderColor: '#E5E7EB' },
      { name: 'Abnormal / Follow-up Required', color: '#F3F4F6', textColor: '#374151', borderColor: '#E5E7EB' }
    ]
  },
  {
    id: 2,
    name: 'Risk',
    tags: [
      { name: 'Low Risk', color: '#D1FAE5', textColor: '#059669', borderColor: '#A7F3D0' },
      { name: 'Medium Risk', color: '#FEF3C7', textColor: '#92400E', borderColor: '#FDE68A' },
      { name: 'High Risk', color: '#FEE2E2', textColor: '#DC2626', borderColor: '#FECACA' },
      { name: 'No Risk', color: '#F3F4F6', textColor: '#374151', borderColor: '#E5E7EB' }
    ]
  }
];

const initialMockRules = [
  {
    id: 1,
    name: 'Auto-assign High Risk Tag',
    conditions: 'IF Age > 50 AND Source = Campaign',
    action: 'Assign Tag: High Risk',
    active: true,
    lastModified: '15 Nov 2024'
  },
  {
    id: 2,
    name: 'Auto-assign to Jasmine Lim',
    conditions: 'IF Status = New AND Source = Event',
    action: 'Assign To: Jasmine Lim',
    active: true,
    lastModified: '12 Nov 2024'
  },
  {
    id: 3,
    name: 'Medium Risk Notification',
    conditions: 'IF Tag = Medium Risk',
    action: 'Send Notification: Team Lead',
    active: false,
    lastModified: '8 Nov 2024'
  }
];

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  itemName: string;
  details: string;
}

const initialAuditLogs: AuditLog[] = [
  {
    id: 1,
    timestamp: '24 Nov 2024, 10:30 AM',
    user: 'Admin User',
    action: 'Created',
    module: 'Rules',
    itemName: 'Auto-assign High Risk Tag',
    details: 'New rule created with conditions: Age > 50 AND Source = Campaign'
  },
  {
    id: 2,
    timestamp: '23 Nov 2024, 3:45 PM',
    user: 'Jasmine Lim',
    action: 'Activated',
    module: 'Tags',
    itemName: 'Low Risk',
    details: 'Tag status changed from Inactive to Active'
  },
  {
    id: 3,
    timestamp: '22 Nov 2024, 2:15 PM',
    user: 'Admin User',
    action: 'Updated',
    module: 'Categories',
    itemName: 'Screening Stage',
    details: 'Added new tag: PAP Test'
  },
  {
    id: 4,
    timestamp: '21 Nov 2024, 11:20 AM',
    user: 'Admin User',
    action: 'Deactivated',
    module: 'Rules',
    itemName: 'Medium Risk Notification',
    details: 'Rule status changed from Active to Inactive'
  },
  {
    id: 5,
    timestamp: '20 Nov 2024, 9:00 AM',
    user: 'Jasmine Lim',
    action: 'Deleted',
    module: 'Tags',
    itemName: 'Very High Risk',
    details: 'Tag permanently removed from system'
  }
];

export function TagConfiguration({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [activeTab, setActiveTab] = useState<'rules' | 'manage-tags' | 'manage-categories' | 'audit-trail'>('rules');
  const [tags, setTags] = useState(mockTags);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [rules, setRules] = useState(initialMockRules);
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [auditSearchTerm, setAuditSearchTerm] = useState('');
  const [auditModuleFilter, setAuditModuleFilter] = useState('all');
  const [auditActionFilter, setAuditActionFilter] = useState('all');

  const toggleTagActive = (id: number) => {
    setTags(tags.map(tag => 
      tag.id === id ? { ...tag, active: !tag.active } : tag
    ));
  };

  const toggleRuleActive = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
  };

  const handleCreateRule = (newRule: {
    name: string;
    conditionType: 'all' | 'any';
    conditions: any[];
    actionType: string;
    actionValue: string;
    active: boolean;
  }) => {
    const today = new Date();
    const formattedDate = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
    
    // Format conditions for display
    const conditionsText = `IF ${newRule.conditions
      .map(c => `${c.field} ${c.operator} ${c.value}`)
      .join(` ${newRule.conditionType.toUpperCase()} `)}`;
    
    // Format action for display
    const actionText = `${newRule.actionType.replace('_', ' ')}: ${newRule.actionValue}`;
    
    const rule = {
      id: rules.length + 1,
      name: newRule.name,
      conditions: conditionsText,
      action: actionText,
      active: newRule.active,
      lastModified: formattedDate
    };

    setRules([rule, ...rules]);
    setIsCreateRuleOpen(false);
  };

  const filteredTags = selectedCategory === 'all' 
    ? tags 
    : tags.filter(tag => tag.category === selectedCategory);

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Configurations</span>
          <span>›</span>
          <span className="text-gray-900">
            {activeTab === 'rules' && 'Rules'}
            {activeTab === 'manage-tags' && 'Manage Tags'}
            {activeTab === 'manage-categories' && 'Manage Categories'}
            {activeTab === 'audit-trail' && 'Audit Trail'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 flex flex-col h-full">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('all-prospects')}
                  className="p-2 h-auto hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" style={{ color: '#6B7280' }} />
                </Button>
                <h1 style={{ fontSize: 'var(--text-h2)' }}>Prospect Configuration</h1>
              </div>
              <Button 
                onClick={() => activeTab === 'rules' ? setIsCreateRuleOpen(true) : null}
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }} 
                className="hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                {activeTab === 'rules' ? 'Create Rule' : 'Add Tag'}
              </Button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex gap-8 px-6">
                  <button
                    onClick={() => setActiveTab('rules')}
                    className="py-4 border-b-2 transition-colors"
                    style={{
                      borderColor: activeTab === 'rules' ? 'var(--primary)' : 'transparent',
                      color: activeTab === 'rules' ? 'var(--primary)' : 'var(--muted-foreground)'
                    }}
                  >
                    Rules
                  </button>
                  <button
                    onClick={() => setActiveTab('manage-tags')}
                    className="py-4 border-b-2 transition-colors"
                    style={{
                      borderColor: activeTab === 'manage-tags' ? 'var(--primary)' : 'transparent',
                      color: activeTab === 'manage-tags' ? 'var(--primary)' : 'var(--muted-foreground)'
                    }}
                  >
                    Manage Tags
                  </button>
                  <button
                    onClick={() => setActiveTab('manage-categories')}
                    className="py-4 border-b-2 transition-colors"
                    style={{
                      borderColor: activeTab === 'manage-categories' ? 'var(--primary)' : 'transparent',
                      color: activeTab === 'manage-categories' ? 'var(--primary)' : 'var(--muted-foreground)'
                    }}
                  >
                    Manage Categories
                  </button>
                  <button
                    onClick={() => setActiveTab('audit-trail')}
                    className="py-4 border-b-2 transition-colors"
                    style={{
                      borderColor: activeTab === 'audit-trail' ? 'var(--primary)' : 'transparent',
                      color: activeTab === 'audit-trail' ? 'var(--primary)' : 'var(--muted-foreground)'
                    }}
                  >
                    Audit Trail
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              {activeTab === 'manage-tags' && (
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search"
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Category</SelectItem>
                        <SelectItem value="Risk">Risk</SelectItem>
                        <SelectItem value="Screening Stage">Screening Stage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div></div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        Filter
                      </Button>
                      <span className="text-sm text-gray-600">Show entries</span>
                      <Button variant="outline" size="sm">
                        10
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'manage-categories' && (
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div></div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        Filter
                      </Button>
                      <span className="text-sm text-gray-600">Show entries</span>
                      <Button variant="outline" size="sm">
                        10
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'audit-trail' && (
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search by user, item name, or details"
                        className="pl-10"
                        value={auditSearchTerm}
                        onChange={(e) => setAuditSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={auditModuleFilter} onValueChange={setAuditModuleFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Modules" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modules</SelectItem>
                        <SelectItem value="Rules">Rules</SelectItem>
                        <SelectItem value="Tags">Tags</SelectItem>
                        <SelectItem value="Categories">Categories</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={auditActionFilter} onValueChange={setAuditActionFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="Created">Created</SelectItem>
                        <SelectItem value="Updated">Updated</SelectItem>
                        <SelectItem value="Deleted">Deleted</SelectItem>
                        <SelectItem value="Activated">Activated</SelectItem>
                        <SelectItem value="Deactivated">Deactivated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div></div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        Filter
                      </Button>
                      <span className="text-sm text-gray-600">Show entries</span>
                      <Button variant="outline" size="sm">
                        10
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto">
                {activeTab === 'manage-tags' ? (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Tag
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Active
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTags.map((tag) => (
                        <tr key={tag.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <span 
                              className="inline-flex items-center px-3 py-1 rounded"
                              style={{
                                backgroundColor: tag.color,
                                color: tag.textColor,
                                border: `1px solid ${tag.borderColor}`,
                                fontSize: 'var(--text-base)',
                                fontWeight: 'var(--font-weight-normal)'
                              }}
                            >
                              {tag.name}
                            </span>
                          </td>
                          <td className="px-6 py-4" style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}>
                            {tag.category}
                          </td>
                          <td className="px-6 py-4">
                            <Switch 
                              checked={tag.active}
                              onCheckedChange={() => toggleTagActive(tag.id)}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-1 h-auto hover:bg-gray-100"
                              >
                                <Pencil className="w-4 h-4" style={{ color: '#6B7280' }} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-1 h-auto hover:bg-gray-100"
                              >
                                <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : activeTab === 'manage-categories' ? (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Tag
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockCategories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4" style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}>
                            {category.name}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {category.tags.map((tag, idx) => (
                                <span 
                                  key={idx}
                                  className="inline-flex items-center px-3 py-1 rounded"
                                  style={{
                                    backgroundColor: tag.color,
                                    color: tag.textColor,
                                    border: `1px solid ${tag.borderColor}`,
                                    fontSize: 'var(--text-base)',
                                    fontWeight: 'var(--font-weight-normal)'
                                  }}
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-1 h-auto hover:bg-gray-100"
                              >
                                <Pencil className="w-4 h-4" style={{ color: '#6B7280' }} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-1 h-auto hover:bg-gray-100"
                              >
                                <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : activeTab === 'rules' ? (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Rule Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Conditions
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Active
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Last Modified
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rules.map((rule) => (
                        <tr key={rule.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4" style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}>
                            {rule.name}
                          </td>
                          <td className="px-6 py-4" style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}>
                            {rule.conditions}
                          </td>
                          <td className="px-6 py-4" style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}>
                            {rule.action}
                          </td>
                          <td className="px-6 py-4">
                            <Switch 
                              checked={rule.active}
                              onCheckedChange={() => toggleRuleActive(rule.id)}
                            />
                          </td>
                          <td className="px-6 py-4" style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}>
                            {rule.lastModified}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-1 h-auto hover:bg-gray-100"
                              >
                                <Pencil className="w-4 h-4" style={{ color: '#6B7280' }} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-1 h-auto hover:bg-gray-100"
                              >
                                <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : activeTab === 'audit-trail' ? (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Module
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Item Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4" style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}>
                            {log.timestamp}
                          </td>
                          <td className="px-6 py-4" style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}>
                            {log.user}
                          </td>
                          <td className="px-6 py-4" style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}>
                            {log.action}
                          </td>
                          <td className="px-6 py-4" style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}>
                            {log.module}
                          </td>
                          <td className="px-6 py-4" style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}>
                            {log.itemName}
                          </td>
                          <td className="px-6 py-4" style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: '#111827'
                          }}>
                            {log.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : null}
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {activeTab === 'manage-tags' 
                    ? `1 to ${filteredTags.length} out of ${filteredTags.length} records`
                    : `1 to ${mockCategories.length} out of ${mockCategories.length} records`
                  }
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    style={{ 
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      borderColor: 'var(--primary-light)'
                    }}
                  >
                    1
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 -mx-6 -mb-6">
            <Footer />
          </div>
        </div>
      </div>

      {/* Create Rule Dialog */}
      <CreateRuleDialog
        open={isCreateRuleOpen}
        onOpenChange={setIsCreateRuleOpen}
        onCreateRule={handleCreateRule}
      />
    </div>
  );
}