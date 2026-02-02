import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Trash2, Edit2 } from 'lucide-react';
import config from '../../config';
import { toast } from 'react-hot-toast';

export default function CompaniesManagement() {
  const [companies, setCompanies] = useState([]);
  const [newCompanies, setNewCompanies] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data } = await axios.get(`${config.API_BASE_URL}/job/companies`);
      setCompanies(data);
    } catch (error) {
      toast.error("Failed to fetch companies");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const companiesToAdd = newCompanies.split(',').map(company => company.trim());
      await axios.post(`${config.API_BASE_URL}/job/companies`, { companies: companiesToAdd });
      toast.success("Companies added successfully");
      setNewCompanies('');
      fetchCompanies();
    } catch (error) {
      toast.error("Failed to add companies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.API_BASE_URL}/job/companies/${id}`);
      toast.success("Company deleted successfully");
      fetchCompanies();
    } catch (error) {
      toast.error("Failed to delete company");
    }
  };

  const handleEdit = async (id) => {
    if (editingId === id) {
      try {
        await axios.put(`${config.API_BASE_URL}/job/companies/${id}`, { name: editValue });
        toast.success("Company updated successfully");
        setEditingId(null);
        fetchCompanies();
      } catch (error) {
        toast.error("Failed to update company");
      }
    } else {
      setEditingId(id);
      setEditValue(companies.find(company => company._id === id).name);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Companies Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={newCompanies}
              onChange={(e) => setNewCompanies(e.target.value)}
              placeholder="Enter company names (comma separated)"
              required
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Companies
            </Button>
          </form>
          <div className="mt-6 space-y-2">
            {companies.map((company) => (
              <div key={company._id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                {editingId === company._id ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-grow mr-2"
                  />
                ) : (
                  <span>{company.name}</span>
                )}
                <div>
                  <Button onClick={() => handleEdit(company._id)} size="sm" variant="ghost">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDelete(company._id)} size="sm" variant="ghost" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}