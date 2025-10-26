import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-2xl font-bold text-gray-800">{job.jobTitle}</h2>
          <Button onClick={onClose} variant="ghost" size="icon">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(90vh-88px)]">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Job Description</h3>
              <p className="text-gray-600">{job.jobDescription}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Average Salary</h3>
              <p className="text-gray-600">${job.averageSalary.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Top Companies</h3>
              <ul className="list-disc pl-5">
                {job.topCompanies.map((company, index) => (
                  <li key={index} className="text-gray-600">{company}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Required Education</h3>
              <div className="space-y-2">
                {job.requiredEducation.map((edu, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold">{edu.college}</p>
                    <p className="text-sm text-gray-600">Fees: ${edu.fees.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Duration: {edu.duration}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Salary Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={job.salaryTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="salary" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Hiring Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={job.hiringTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="hired" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Work Environment</h3>
              <p className="text-gray-600">{job.workEnvironment}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Challenges</h3>
              <ul className="list-disc pl-5">
                {job.challenges.map((challenge, index) => (
                  <li key={index} className="text-gray-600">{challenge}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Rewards</h3>
              <ul className="list-disc pl-5">
                {job.rewards.map((reward, index) => (
                  <li key={index} className="text-gray-600">{reward}</li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
};

export default JobDetailsModal;