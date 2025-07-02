
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddRoomDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, type: string) => void;
}

const roomTypes = [
  'Living Room',
  'Bedroom',
  'Master Bedroom',
  'Guest Bedroom',
  'Kitchen',
  'Dining Room',
  'Bathroom',
  'Master Bathroom',
  'Home Office',
  'Study Room',
  'Balcony',
  'Terrace',
  'Garden',
  'Garage',
  'Basement',
  'Attic',
  'Laundry Room',
  'Storage Room',
  'Hallway',
  'Stairway',
  'Other'
];

const AddRoomDialog = ({ open, onClose, onAdd }: AddRoomDialogProps) => {
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim() && roomType) {
      onAdd(roomName.trim(), roomType);
      setRoomName('');
      setRoomType('');
    }
  };

  const handleClose = () => {
    setRoomName('');
    setRoomType('');
    onClose();
  };

  const handleTypeSelect = (type: string) => {
    setRoomType(type);
    if (!roomName.trim()) {
      setRoomName(type);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Add New Room
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomType" className="text-slate-700 font-medium">
              Room Type
            </Label>
            <Select value={roomType} onValueChange={handleTypeSelect}>
              <SelectTrigger className="border-slate-300 focus:border-teal-500 focus:ring-teal-500">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 max-h-60">
                {roomTypes.map((type) => (
                  <SelectItem key={type} value={type} className="hover:bg-slate-50">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roomName" className="text-slate-700 font-medium">
              Room Name
            </Label>
            <Input
              id="roomName"
              placeholder="e.g., Master Bedroom, Kitchen"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
            />
            <p className="text-xs text-slate-500">
              You can customize the name or keep the default room type
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!roomName.trim() || !roomType}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
            >
              Add Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomDialog;
