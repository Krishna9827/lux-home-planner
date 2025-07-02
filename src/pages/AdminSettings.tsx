
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DefaultSettings {
  applianceCategories: string[];
  wattagePresets: number[];
  exportFormats: string[];
}

const AdminSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState<DefaultSettings>({
    applianceCategories: ['Lights', 'Fans', 'HVAC', 'Smart Devices', 'Curtain & Blinds', 'Security'],
    wattagePresets: [3, 6, 9, 12, 15, 18, 24, 36, 50, 100],
    exportFormats: ['PDF', 'Excel', 'Word']
  });
  
  const [newCategory, setNewCategory] = useState('');
  const [newWattage, setNewWattage] = useState('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Admin settings have been updated successfully."
    });
  };

  const addCategory = () => {
    if (newCategory.trim() && !settings.applianceCategories.includes(newCategory.trim())) {
      setSettings(prev => ({
        ...prev,
        applianceCategories: [...prev.applianceCategories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setSettings(prev => ({
      ...prev,
      applianceCategories: prev.applianceCategories.filter(c => c !== category)
    }));
  };

  const addWattage = () => {
    const wattage = parseInt(newWattage);
    if (!isNaN(wattage) && wattage > 0 && !settings.wattagePresets.includes(wattage)) {
      setSettings(prev => ({
        ...prev,
        wattagePresets: [...prev.wattagePresets, wattage].sort((a, b) => a - b)
      }));
      setNewWattage('');
    }
  };

  const removeWattage = (wattage: number) => {
    setSettings(prev => ({
      ...prev,
      wattagePresets: prev.wattagePresets.filter(w => w !== wattage)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <Building2 className="w-6 h-6 text-teal-600" />
                <h1 className="text-xl font-bold text-slate-900">Admin Settings</h1>
              </div>
            </div>
            
            <Button
              onClick={saveSettings}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Appliance Categories */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Default Appliance Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {settings.applianceCategories.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="bg-white hover:bg-red-50 group cursor-pointer"
                  onClick={() => removeCategory(category)}
                >
                  {category}
                  <Trash2 className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 text-red-500" />
                </Badge>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Enter new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
              />
              <Button onClick={addCategory} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wattage Presets */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Default Wattage Presets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {settings.wattagePresets.map((wattage) => (
                <Badge
                  key={wattage}
                  variant="outline"
                  className="bg-white hover:bg-red-50 group cursor-pointer"
                  onClick={() => removeWattage(wattage)}
                >
                  {wattage}W
                  <Trash2 className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 text-red-500" />
                </Badge>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Enter wattage"
                value={newWattage}
                onChange={(e) => setNewWattage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addWattage()}
              />
              <Button onClick={addWattage} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Export Formats */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Export Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {settings.exportFormats.map((format) => (
                <Badge key={format} variant="outline" className="bg-white">
                  {format}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
