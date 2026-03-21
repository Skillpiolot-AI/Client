import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function PortfolioTab({ profile }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-16">
      <header className="mb-12">
        <h2 className="text-3xl lg:text-4xl font-extrabold font-headline text-primary mb-4">Portfolio & Goals</h2>
        <p className="text-base lg:text-lg text-secondary leading-relaxed">
          Projects, certifications, and career aspirations.
        </p>
      </header>

      <div className="space-y-12">
        {/* Projects */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-primary">My Projects</h3>
            <Link to="/add-project" className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile?.projects?.length > 0 ? profile.projects.map((project, index) => (
              <Card key={index} className="bg-surface-container-lowest border-outline-variant/10 shadow-sm rounded-xl">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-lg text-on-surface">{project.title}</h4>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      project.status === 'Completed' ? 'bg-teal-100 text-teal-800' :
                      project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>{project.status}</span>
                  </div>
                  <p className="text-sm text-secondary font-medium">Tech: {project.technologies?.join(', ')}</p>
                </CardContent>
              </Card>
            )) : <p className="text-secondary text-sm italic">No projects added yet.</p>}
          </div>
        </section>

        {/* Certifications */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-primary">My Certifications</h3>
            <Link to="/add-certification" className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" /> Add Certification
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile?.certifications?.length > 0 ? profile.certifications.map((cert, index) => (
              <Card key={index} className="bg-surface-container-lowest border-outline-variant/10 shadow-sm rounded-xl">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-lg text-on-surface">{cert.title}</h4>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      cert.status === 'Achieved' ? 'bg-teal-100 text-teal-800' :
                      cert.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>{cert.status}</span>
                  </div>
                  <p className="text-sm text-secondary font-medium">Issuer: {cert.issuer}</p>
                </CardContent>
              </Card>
            )) : <p className="text-secondary text-sm italic">No certifications added yet.</p>}
          </div>
        </section>

        {/* Goals */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-primary">My Goals</h3>
            <Link to="/add-goal" className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" /> Add Goal
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile?.goals?.length > 0 ? profile.goals.map((goal, index) => (
              <Card key={index} className="bg-surface-container-lowest border-outline-variant/10 shadow-sm rounded-xl">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-lg text-on-surface">{goal.title}</h4>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      goal.status === 'Completed' ? 'bg-teal-100 text-teal-800' :
                      goal.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      goal.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>{goal.status}</span>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed">{goal.description}</p>
                </CardContent>
              </Card>
            )) : <p className="text-secondary text-sm italic">No goals added yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
