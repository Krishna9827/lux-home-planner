
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddItemForm } from './inventory/AddItemForm';
import { PriceTable } from './inventory/PriceTable';
import { defaultPrices } from './inventory/constants';
import type { PriceData, NewItemForm } from './inventory/types';

const InventoryManagement = () => {
  const { toast } = useToast();
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<NewItemForm>({
    category: '',
    subcategory: '',
    wattage: '',
    pricePerUnit: '',
    notes: ''
  });

  useEffect(() => {
    const savedPrices = localStorage.getItem('inventoryPrices');
    if (savedPrices) {
      setPriceData(JSON.parse(savedPrices));
    } else {
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

  return (
    <div className="space-y-6">
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

      {showAddForm && (
        <AddItemForm
          newItem={newItem}
          setNewItem={setNewItem}
          onSave={handleAddItem}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-800">Current Price List</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceTable
            priceData={priceData}
            editingId={editingId}
            setEditingId={setEditingId}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
