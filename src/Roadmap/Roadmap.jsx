import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Code, Database, Server, PenTool, Cpu, TrendingUp } from 'lucide-react';

// Define the career paths with icons and paths
const careerPaths = [
  { id: 'software-engineer', title: 'Software Engineer', icon: Code, color: 'blue', path: '/softwareengineer' },
  { id: 'data-scientist', title: 'Data Scientist', icon: Database, color: 'green', path: '/datascientist' },
//   { id: 'devops-engineer', title: 'DevOps Engineer', icon: Server, color: 'purple', path: '/devopsengineer' },
//   { id: 'ux-designer', title: 'UX Designer', icon: PenTool, color: 'pink', path: '/uxdesigner' },
//   { id: 'ai-engineer', title: 'AI Engineer', icon: Cpu, color: 'red', path: '/aiengineer' },
  { id: 'Front-end', title: 'Product Manager', icon: TrendingUp, color: 'yellow', path: '/productmanager' },

];

// CareerCard Component for each career option
const CareerCard = ({ career }) => {
  const bgColorClass = `bg-${career.color}-100`;
  const textColorClass = `text-${career.color}-600`;
  const borderColorClass = `border-${career.color}-200`;
  const hoverBgColorClass = `hover:bg-${career.color}-50`;

  return (
    <Link 
      to={career.path}
      className={`cursor-pointer border ${borderColorClass} rounded-lg overflow-hidden shadow-md transition-all duration-300 ease-in-out ${hoverBgColorClass} hover:shadow-lg`}
    >
      <div className={`p-6 ${bgColorClass}`}>
        <career.icon className={`w-12 h-12 ${textColorClass} mb-4`} />
        <h3 className={`text-xl font-semibold ${textColorClass}`}>{career.title}</h3>
      </div>
    </Link>
  );
};

// TechCareerPathsHub Component to display the grid of career options
const TechCareerPathsHub = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Choose Your Tech Career Path
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {careerPaths.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechCareerPathsHub