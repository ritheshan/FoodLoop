import { useState } from 'react';
import { Calendar, Thermometer, Clock, Scale, PlusCircle } from 'lucide-react';
import { createRecurForm } from '../../services/dashboardService';

export default function RecurringForm() {
  const [formData, setFormData] = useState({
    foodType: '',
    storage: 'room temp',
    frequency: 'daily',
    startDate: '',
    weight: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // alert('Food reminder added: ' + JSON.stringify(formData, null, 2));
    const data = await createRecurForm(formData);
    console.log(data);
  };

  return (
    <div className="max-w-md  bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-1 w-[30rem]">
      <div className="bg-gradient-to-r from-amber-400 to-colour1 p-4 text-white font-bold text-xl flex items-center rounded-t-lg">
        <PlusCircle className="mr-2" />
        Add Food Reminder
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Food Type Input */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Food Item</label>
          <div className="relative rounded-md shadow-sm">
            <input
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              placeholder="e.g. dal rice"
              className="block w-full rounded-md border-gray-300 border p-2 focus:border-amber-950 focus:ring focus:ring-amber-950focus:ring-opacity-50"
            />
          </div>
        </div>
        
        {/* Storage Option */}
        <div className="space-y-1">
          <label className=" text-sm font-medium text-gray-700 flex items-center">
            <Thermometer className="mr-2 text-amber-950" size={20} />
            Storage Method
          </label>
          <select
            name="storage"
            value={formData.storage}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 border p-2 focus:border-amber-800 focus:ring focus:ring-amber-800focus:ring-opacity-50"
          >
            <option>room temp</option>
            <option>refrigerated</option>
            <option>frozen</option>
          </select>
        </div>
        
        {/* Frequency Option */}
        <div className="space-y-1">
          <label className=" text-sm font-medium text-gray-700 flex items-center">
            <Clock className="mr-2 text-amber-950" size={20} />
            Check Frequency
          </label>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 border p-2 focus:border-amber-800 focus:ring focus:ring-amber-800 focus:ring-opacity-50"
          >
            <option>daily</option>
            <option>weekly</option>
            <option>monthly</option>
          </select>
        </div>
        
        {/* Start Date */}
        <div className="space-y-1">
          <label className=" text-sm font-medium text-gray-700 flex items-center">
            <Calendar className="mr-2 text-amber-950" size={20} />
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 border p-2 focus:border-amber-800 focus:ring focus:ring-amber-800 focus:ring-opacity-50"
          />
        </div>
        
        {/* Weight Input */}
        <div className="space-y-1">
          <label className=" text-sm font-medium text-gray-700 flex items-center">
            <Scale className="mr-2 text-amber-950" size={20} />
            Quantity
          </label>
          <input
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="e.g. 2 kg"
            className="block w-full rounded-md border-gray-300 border p-2 focus:border-amber-800 focus:ring focus:ring-amber-800 focus:ring-opacity-50"
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r bg-colour1 text-white py-2 px-4 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition all duration-200 flex items-center justify-center"
        >
          <PlusCircle className="mr-2" size={20} />
          Add Reminder
        </button>
      </form>
    </div>
  );
}