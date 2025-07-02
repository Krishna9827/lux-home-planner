
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Lightbulb, Settings, FileText } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({
    projectName: '',
    clientName: '',
    architectName: '',
    designerName: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const handleStartProject = () => {
    if (projectData.projectName && projectData.clientName) {
      localStorage.setItem('projectData', JSON.stringify(projectData));
      navigate('/planner');
    }
  };

  const isFormValid = projectData.projectName.trim() && projectData.clientName.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">AutoPlan Pro</h1>
                <p className="text-sm text-slate-600">Home Automation Planning Suite</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-6">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Simplify Your Home Automation Projects
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Professional planning tool for architects, designers, and electrical consultants. 
            Create detailed appliance specifications with ease.
          </p>
        </div>

        {/* Project Setup Form */}
        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-slate-900">Start New Project</CardTitle>
            <CardDescription className="text-slate-600">
              Enter your project details to begin planning
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-slate-700 font-medium">
                  Project Name *
                </Label>
                <Input
                  id="projectName"
                  placeholder="e.g., Luxury Villa Automation"
                  value={projectData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-slate-700 font-medium">
                  Client Name *
                </Label>
                <Input
                  id="clientName"
                  placeholder="e.g., John & Sarah Smith"
                  value={projectData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="architectName" className="text-slate-700 font-medium">
                  Architect Name
                </Label>
                <Input
                  id="architectName"
                  placeholder="e.g., Johnson & Associates"
                  value={projectData.architectName}
                  onChange={(e) => handleInputChange('architectName', e.target.value)}
                  className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designerName" className="text-slate-700 font-medium">
                  Interior Designer
                </Label>
                <Input
                  id="designerName"
                  placeholder="e.g., Creative Interiors Ltd."
                  value={projectData.designerName}
                  onChange={(e) => handleInputChange('designerName', e.target.value)}
                  className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <Label htmlFor="notes" className="text-slate-700 font-medium">
                Project Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional project requirements or specifications..."
                value={projectData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="border-slate-300 focus:border-teal-500 focus:ring-teal-500 min-h-[100px]"
              />
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleStartProject}
                disabled={!isFormValid}
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FileText className="w-5 h-5 mr-2" />
                Start Planning
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Room Planning</h3>
              <p className="text-sm text-slate-600">Organize by rooms and zones with intelligent categorization</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Smart Appliances</h3>
              <p className="text-sm text-slate-600">Comprehensive database with specifications and suggestions</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Professional Reports</h3>
              <p className="text-sm text-slate-600">Generate detailed documentation and specifications</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
