
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PriceData {
  id: string;
  category: string;
  subcategory?: string;
  wattage?: number;
  pricePerUnit: number;
  notes?: string;
}

const InventoryManagement = () => {
  const { toast } = useToast();
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    category: '',
    subcategory: '',
    wattage: '',
    pricePerUnit: '',
    notes: ''
  });

  const categories = [
    'Lights', 'Fans', 'HVAC', 'Smart Devices', 
    'Curtain & Blinds', 'Security', 'Other'
  ];

  useEffect(() => {
    const savedPrices = localStorage.getItem('inventoryPrices');
    if (savedPrices) {
      setPriceData(JSON.parse(savedPrices));
    } else {
      // Initialize with default data
      const defaultPrices: PriceData[] = [
        { id: '1', category: 'Lights', subcategory: 'Basic ON/OFF', wattage: 6, pricePerUnit: 150 },
        { id: '2', category: 'Lights', subcategory: 'Tunable', wattage: 9, pricePerUnit: 250 },
        { id: '3', category: 'Lights', subcategory: 'RGB', wattage: 12, pricePerUnit: 350 },
        { id: '4', category: 'Lights', subcategory: 'RGBW', wattage: 15, pricePerUnit: 450 },
        { id: '5', category: 'Fans', pricePerUnit: 2000, notes: 'Ceiling fan' },
        { id: '6', category: 'HVAC', pricePerUnit: 35000, notes: 'Standard AC unit' },
        { id: '7', category: 'Curtain & Blinds', pricePerUnit: 7000, notes: 'Smart Wi-Fi motor' },
        { id: '8', category: 'Smart Devices', pricePerUnit: 1500, notes: 'Smart switch/sensor' },
        { id: '9', category: 'Security', pricePerUnit: 3000, notes: 'Security device' }
      ];
      setPriceData(defaultPrices);
      localStorage.setItem('inventoryPrices', JSON.stringify(defaultPrices));
    }
  }, []);

  const savePriceData = (data: PriceData[]) => {
    setPriceData(data);
    localStorage.setItem('inventoryPrices', JSON.stringify(data));
  };

  const handleAddItem = () => {
    if (!newItem.category || !newItem.pricePerUnit) {
      toast({
        title: "Error",
        description: "Category and price are required fields.",
        variant: "destructive"
      });
      return;
    }

    const newPriceItem: PriceData = {
      id: Date.now().toString(),
      category: newItem.category,
      subcategory: newItem.subcategory || undefined,
      wattage: newItem.wattage ? parseInt(newItem.wattage) : undefined,
      pricePerUnit: parseFloat(newItem.pricePerUnit),
      notes: newItem.notes || undefined
    };

    const updatedData = [...priceData, newPriceItem];
    savePriceData(updatedData);
    
    setNewItem({
      category: '',
      subcategory: '',
      wattage: '',
      pricePerUnit: '',
      notes: ''
    });
    setShowAddForm(false);

    toast({
      title: "Item Added",
      description: "New price item has been added successfully."
    });
  };

  const handleUpdateItem = (id: string, field: string, value: string) => {
    const updatedData = priceData.map(item => {
      if (item.id === id) {
        if (field === 'pricePerUnit') {
          return { ...item, [field]: parseFloat(value) || 0 };
        } else if (field === 'wattage') {
          return { ...item, [field]: value ? parseInt(value) : undefined };
        } else {
          return { ...item, [field]: value || undefined };
        }
      }
      return item;
    });
    savePriceData(updatedData);
  };

  const handleDeleteItem = (id: string) => {
    const updatedData = priceData.filter(item => item.id !== id);
    savePriceData(updatedData);
    
    toast({
      title: "Item Deleted",
      description: "Price item has been removed successfully."
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Lights': return 'bg-yellow-100 text-yellow-800';
      case 'Fans': return 'bg-blue-100 text-blue-800';
      case 'HVAC': return 'bg-red-100 text-red-800';
      case 'Smart Devices': return 'bg-purple-100 text-purple-800';
      case 'Curtain & Blinds': return 'bg-green-100 text-green-800';
      case 'Security': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Inventory Management</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Add New Item Form */}
      {showAddForm && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Add New Price Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subcategory">Type/Variant</Label>
                <Input
                  id="subcategory"
                  value={newItem.subcategory}
                  onChange={(e) => setNewItem({...newItem, subcategory: e.target.value})}
                  placeholder="e.g., RGB, Tunable"
                />
              </div>
              <div>
                <Label htmlFor="wattage">Wattage</Label>
                <Input
                  id="wattage"
                  type="number"
                  value={newItem.wattage}
                  onChange={(e) => setNewItem({...newItem, wattage: e.target.value})}
                  placeholder="e.g., 12"
                />
              </div>
              <div>
                <Label htmlFor="price">Price per Unit *</Label>
                <Input
                  id="price"
                  type="number"
                  value={newItem.pricePerUnit}
                  onChange={(e) => setNewItem({...newItem, pricePerUnit: e.target.value})}
                  placeholder="e.g., 250"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newItem.notes}
                  onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                  placeholder="Optional notes"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button onClick={handleAddItem} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-800">Current Price List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Type/Variant</TableHead>
                <TableHead>Wattage</TableHead>
                <TableHead>Price per Unit</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline" className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        value={item.subcategory || ''}
                        onChange={(e) => handleUpdateItem(item.id, 'subcategory', e.target.value)}
                        size="sm"
                      />
                    ) : (
                      item.subcategory || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={item.wattage?.toString() || ''}
                        onChange={(e) => handleUpdateItem(item.id, 'wattage', e.target.value)}
                        size="sm"
                      />
                    ) : (
                      item.wattage ? `${item.wattage}W` : '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={item.pricePerUnit.toString()}
                        onChange={(e) => handleUpdateItem(item.id, 'pricePerUnit', e.target.value)}
                        size="sm"
                      />
                    ) : (
                      `₹${item.pricePerUnit.toLocaleString()}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        value={item.notes || ''}
                        onChange={(e) => handleUpdateItem(item.id, 'notes', e.target.value)}
                        size="sm"
                      />
                    ) : (
                      item.notes || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingId === item.id ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(null)}
                        >
                          <Save className="w-3 h-3" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(item.id)}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
