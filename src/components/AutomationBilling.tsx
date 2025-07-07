
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { Download, Calculator, Zap, Wifi, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { generateAutomationBillingPDF } from '@/utils/automationBillingPdfExport';
import { useToast } from '@/hooks/use-toast';

interface Appliance {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  quantity: number;
  wattage?: number;
  specifications: Record<string, any>;
}

interface Room {
  id: string;
  name: string;
  type: string;
  appliances: Appliance[];
}

interface ProjectData {
  projectName: string;
  clientName: string;
  architectName: string;
  designerName: string;
  notes: string;
}

interface WiredModule {
  name: string;
  capacity: number;
  price: number;
  notes: string;
}

interface AutomationBillingProps {
  projectData: ProjectData;
  rooms: Room[];
  onClose: () => void;
}

const AutomationBilling = ({ projectData, rooms, onClose }: AutomationBillingProps) => {
  const { toast } = useToast();
  const [automationType, setAutomationType] = useState<'wired' | 'wireless'>('wireless');
  const [knxWireLength, setKnxWireLength] = useState<number>(0);
  const [priceData, setPriceData] = useState<any[]>([]);

  // Wired automation modules
  const wiredModules = {
    onOffActuator8: { name: 'ON/OFF Actuator 8 Channel', capacity: 8, price: 25500, notes: '8 points' },
    onOffActuator16: { name: 'ON/OFF Actuator 16 Channel', capacity: 16, price: 38000, notes: '16 points' },
    lightingModule64: { name: 'Lighting Module 64 Channel', capacity: 64, price: 28000, notes: '64 Ch' },
    lightingModule128: { name: 'Lighting Module 128 Channel', capacity: 128, price: 49000, notes: '128 Ch' },
    ipToKnx: { name: 'IP to KNX Interface', capacity: 1, price: 44000, notes: 'Always required' },
    powerSupply: { name: 'Auxiliary Power Supply', capacity: 1, price: 5500, notes: 'Always required' },
    mainProcessor: { name: 'Main Processor (Voice, Interface)', capacity: 1, price: 59000, notes: 'Always required' },
    knxWiring: { name: 'KNX Wiring', capacity: 1, price: 80, notes: 'Per meter' }
  };

  useEffect(() => {
    const savedPrices = localStorage.getItem('inventoryPrices');
    if (savedPrices) {
      setPriceData(JSON.parse(savedPrices));
    }
  }, []);

  const getAppliancePrice = (appliance: Appliance): number => {
    const priceEntry = priceData.find(price => 
      price.category === appliance.category &&
      (price.subcategory === appliance.subcategory || !price.subcategory) &&
      (price.wattage === appliance.wattage || !price.wattage)
    );
    
    return priceEntry?.pricePerUnit || 500;
  };

  const calculateWirelessCost = () => {
    let totalCost = 0;
    const breakdown: any[] = [];

    rooms.forEach(room => {
      room.appliances.forEach(appliance => {
        const unitPrice = getAppliancePrice(appliance);
        const totalPrice = unitPrice * appliance.quantity;
        totalCost += totalPrice;
        
        breakdown.push({
          roomName: room.name,
          applianceName: appliance.name,
          category: appliance.category,
          quantity: appliance.quantity,
          unitPrice,
          totalPrice
        });
      });
    });

    return { totalCost, breakdown };
  };

  const calculateWiredCost = () => {
    // Calculate total ON/OFF points and lighting channels
    let totalOnOffPoints = 0;
    let totalLightingChannels = 0;

    rooms.forEach(room => {
      room.appliances.forEach(appliance => {
        if (appliance.category === 'Fans' || appliance.category === 'HVAC' || appliance.category === 'Curtain & Blinds') {
          totalOnOffPoints += appliance.quantity;
        } else if (appliance.category === 'Lights') {
          totalLightingChannels += appliance.quantity;
        }
      });
    });

    // Optimize ON/OFF actuators
    const onOffOptimization = optimizeOnOffActuators(totalOnOffPoints);
    
    // Optimize lighting modules
    const lightingOptimization = optimizeLightingModules(totalLightingChannels);

    // Calculate mandatory components
    const mandatoryComponents = [
      { ...wiredModules.ipToKnx, quantity: 1 },
      { ...wiredModules.powerSupply, quantity: 1 },
      { ...wiredModules.mainProcessor, quantity: 1 }
    ];

    // Calculate KNX wiring cost
    const wiringCost = knxWireLength * wiredModules.knxWiring.price;

    const totalCost = 
      onOffOptimization.totalCost + 
      lightingOptimization.totalCost + 
      mandatoryComponents.reduce((sum, comp) => sum + (comp.price * comp.quantity), 0) +
      wiringCost;

    return {
      totalCost,
      onOffOptimization,
      lightingOptimization,
      mandatoryComponents,
      wiringCost,
      totalOnOffPoints,
      totalLightingChannels
    };
  };

  const optimizeOnOffActuators = (totalPoints: number) => {
    if (totalPoints === 0) return { modules: [], totalCost: 0, recommendation: '' };

    const modules = [];
    let remainingPoints = totalPoints;
    let totalCost = 0;

    // Calculate cost with 16-channel modules first
    const modules16Only = Math.ceil(totalPoints / 16);
    const cost16Only = modules16Only * wiredModules.onOffActuator16.price;

    // Calculate mixed approach
    const modules16Mixed = Math.floor(totalPoints / 16);
    const remaining8 = totalPoints % 16;
    const modules8Mixed = remaining8 > 0 ? Math.ceil(remaining8 / 8) : 0;
    const costMixed = (modules16Mixed * wiredModules.onOffActuator16.price) + (modules8Mixed * wiredModules.onOffActuator8.price);

    let recommendation = '';
    
    if (cost16Only <= costMixed) {
      // Use 16-channel modules only
      modules.push({ ...wiredModules.onOffActuator16, quantity: modules16Only });
      totalCost = cost16Only;
      recommendation = `Optimized: ${modules16Only} x 16Ch modules for best value`;
    } else {
      // Use mixed approach
      if (modules16Mixed > 0) {
        modules.push({ ...wiredModules.onOffActuator16, quantity: modules16Mixed });
      }
      if (modules8Mixed > 0) {
        modules.push({ ...wiredModules.onOffActuator8, quantity: modules8Mixed });
      }
      totalCost = costMixed;
      recommendation = `Optimized: ${modules16Mixed} x 16Ch + ${modules8Mixed} x 8Ch modules`;
    }

    return { modules, totalCost, recommendation };
  };

  const optimizeLightingModules = (totalChannels: number) => {
    if (totalChannels === 0) return { modules: [], totalCost: 0, recommendation: '' };

    const modules = [];
    let totalCost = 0;

    // Calculate cost with 128-channel modules first
    const modules128Only = Math.ceil(totalChannels / 128);
    const cost128Only = modules128Only * wiredModules.lightingModule128.price;

    // Calculate mixed approach
    const modules128Mixed = Math.floor(totalChannels / 128);
    const remaining64 = totalChannels % 128;
    const modules64Mixed = remaining64 > 0 ? Math.ceil(remaining64 / 64) : 0;
    const costMixed = (modules128Mixed * wiredModules.lightingModule128.price) + (modules64Mixed * wiredModules.lightingModule64.price);

    let recommendation = '';
    
    if (cost128Only <= costMixed) {
      // Use 128-channel modules only
      modules.push({ ...wiredModules.lightingModule128, quantity: modules128Only });
      totalCost = cost128Only;
      recommendation = `Optimized: ${modules128Only} x 128Ch modules for best value`;
    } else {
      // Use mixed approach
      if (modules128Mixed > 0) {
        modules.push({ ...wiredModules.lightingModule128, quantity: modules128Mixed });
      }
      if (modules64Mixed > 0) {
        modules.push({ ...wiredModules.lightingModule64, quantity: modules64Mixed });
      }
      totalCost = costMixed;
      recommendation = `Optimized: ${modules128Mixed} x 128Ch + ${modules64Mixed} x 64Ch modules`;
    }

    return { modules, totalCost, recommendation };
  };

  const wirelessResult = calculateWirelessCost();
  const wiredResult = calculateWiredCost();

  const handleDownloadPDF = () => {
    const billingData = automationType === 'wireless' ? wirelessResult : wiredResult;
    generateAutomationBillingPDF(projectData, rooms, automationType, billingData, knxWireLength);
    toast({
      title: "Billing Estimate Downloaded",
      description: `Your ${automationType} automation billing estimate has been generated successfully.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calculator className="w-6 h-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-slate-900">Automation Billing</h2>
        </div>
        <Button
          onClick={handleDownloadPDF}
          className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Automation Type Selection */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-800">Select Automation Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Toggle 
                pressed={automationType === 'wireless'} 
                onPressedChange={() => setAutomationType('wireless')}
                className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
              >
                <Wifi className="w-4 h-4 mr-2" />
                Wireless Automation
              </Toggle>
            </div>
            <div className="flex items-center space-x-2">
              <Toggle 
                pressed={automationType === 'wired'} 
                onPressedChange={() => setAutomationType('wired')}
                className="data-[state=on]:bg-orange-500 data-[state=on]:text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                Wired Automation
              </Toggle>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KNX Wire Length Input for Wired */}
      {automationType === 'wired' && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">KNX Wiring Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="wireLength">Total KNX Wire Length (meters)</Label>
                <Input
                  id="wireLength"
                  type="number"
                  value={knxWireLength}
                  onChange={(e) => setKnxWireLength(Number(e.target.value))}
                  placeholder="Enter total wire length"
                />
              </div>
              <div className="text-sm text-slate-600">
                Cost: ₹{(knxWireLength * 80).toLocaleString()} @ ₹80/meter
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Summary */}
      <Card className="border-slate-200 bg-gradient-to-br from-teal-50 to-teal-100">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-teal-700">
            ₹{(automationType === 'wireless' ? wirelessResult.totalCost : wiredResult.totalCost).toLocaleString()}
          </div>
          <div className="text-teal-600 mt-2">
            Total {automationType === 'wireless' ? 'Wireless' : 'Wired'} Automation Cost
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      {automationType === 'wireless' ? (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Wireless Automation Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wirelessResult.breakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">{item.applianceName}</div>
                    <div className="text-sm text-slate-600">{item.roomName} • Qty: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">₹{item.totalPrice.toLocaleString()}</div>
                    <div className="text-sm text-slate-600">₹{item.unitPrice}/unit</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* System Requirements */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">System Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{wiredResult.totalOnOffPoints}</div>
                  <div className="text-sm text-blue-600">ON/OFF Points</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-700">{wiredResult.totalLightingChannels}</div>
                  <div className="text-sm text-yellow-600">Lighting Channels</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ON/OFF Actuators */}
          {wiredResult.onOffOptimization.modules.length > 0 && (
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">ON/OFF Actuators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wiredResult.onOffOptimization.modules.map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-900">{module.name}</div>
                        <div className="text-sm text-slate-600">Quantity: {module.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-900">₹{(module.price * module.quantity).toLocaleString()}</div>
                        <div className="text-sm text-slate-600">₹{module.price.toLocaleString()}/unit</div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">{wiredResult.onOffOptimization.recommendation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lighting Modules */}
          {wiredResult.lightingOptimization.modules.length > 0 && (
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Lighting Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wiredResult.lightingOptimization.modules.map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-900">{module.name}</div>
                        <div className="text-sm text-slate-600">Quantity: {module.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-900">₹{(module.price * module.quantity).toLocaleString()}</div>
                        <div className="text-sm text-slate-600">₹{module.price.toLocaleString()}/unit</div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">{wiredResult.lightingOptimization.recommendation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mandatory Components */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Mandatory Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {wiredResult.mandatoryComponents.map((component, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">{component.name}</div>
                      <div className="text-sm text-slate-600">{component.notes}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">₹{component.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                {knxWireLength > 0 && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">KNX Wiring</div>
                      <div className="text-sm text-slate-600">{knxWireLength} meters @ ₹80/meter</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">₹{wiredResult.wiringCost.toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Disclaimer */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm text-orange-800 font-medium">Important Disclaimer</p>
              <p className="text-sm text-orange-700 mt-1">
                This is a preliminary estimate. Final quotation may vary based on site conditions, 
                customization requirements, and current market rates. {automationType === 'wired' && 
                'Wired automation pricing includes optimized module selection for cost efficiency.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationBilling;
