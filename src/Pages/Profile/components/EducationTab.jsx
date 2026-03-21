import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function EducationTab({ isEditing, profile, formData, handleInputChange, handleJobRoleChange, handleSubmit }) {
  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-16">
        <header className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold font-headline text-primary mb-4">Edit Education</h2>
          <p className="text-base lg:text-lg text-secondary leading-relaxed">
            Update your academic history and future career goals.
          </p>
        </header>

        <section className="bg-surface-container-low rounded-xl p-6 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 10th Grade */}
            <div>
              <h3 className="text-xl font-bold font-headline text-primary mb-4">10th Grade</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Overall Percentage</label>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium"
                    value={formData.tenthGrade.percentage}
                    onChange={(e) => handleInputChange(e, 'tenthGrade', 'percentage')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Maths</label>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium"
                    value={formData.tenthGrade.maths}
                    onChange={(e) => handleInputChange(e, 'tenthGrade', 'maths')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Science</label>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium"
                    value={formData.tenthGrade.science}
                    onChange={(e) => handleInputChange(e, 'tenthGrade', 'science')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">English</label>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium"
                    value={formData.tenthGrade.english}
                    onChange={(e) => handleInputChange(e, 'tenthGrade', 'english')}
                    required
                  />
                </div>
              </div>
            </div>

            <hr className="border-outline-variant/10" />

            {/* 12th Grade */}
            <div>
              <h3 className="text-xl font-bold font-headline text-primary mb-4">12th Grade</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Overall Percentage</label>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium"
                    value={formData.twelfthGrade.percentage}
                    onChange={(e) => handleInputChange(e, 'twelfthGrade', 'percentage')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Maths</label>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium"
                    value={formData.twelfthGrade.maths}
                    onChange={(e) => handleInputChange(e, 'twelfthGrade', 'maths')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Physics</label>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium"
                    value={formData.twelfthGrade.physics}
                    onChange={(e) => handleInputChange(e, 'twelfthGrade', 'physics')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Chemistry</label>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium"
                    value={formData.twelfthGrade.chemistry}
                    onChange={(e) => handleInputChange(e, 'twelfthGrade', 'chemistry')}
                    required
                  />
                </div>
              </div>
            </div>

            <hr className="border-outline-variant/10" />

            {/* Job Roles Predicted */}
            <div>
              <h3 className="text-xl font-bold font-headline text-primary mb-4">Target Job Roles</h3>
              <div className="space-y-4">
                {formData.jobRolesPredicted.map((role, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Job Role {index + 1}</label>
                    <input
                      className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium"
                      value={role}
                      onChange={(e) => handleJobRoleChange(index, e.target.value)}
                      placeholder={`Target Role ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button 
                type="submit" 
                className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all"
              >
                Save Education Details
              </button>
            </div>
          </form>
        </section>
      </div>
    );
  }

  // View Mode
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-16">
      <header className="mb-12">
        <h2 className="text-3xl lg:text-4xl font-extrabold font-headline text-primary mb-4">Education & Goals</h2>
        <p className="text-base lg:text-lg text-secondary leading-relaxed">
          Overview of your academic background and career targets.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-surface-container-lowest border border-outline-variant/10 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-secondary">10th Grade</CardTitle>
            <GraduationCap className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-primary mb-2">{profile?.tenthGrade?.percentage || 'N/A'}%</div>
            <p className="text-sm text-on-surface-variant font-medium">
              Maths: {profile?.tenthGrade?.maths || '-'}% • Science: {profile?.tenthGrade?.science || '-'}% • English: {profile?.tenthGrade?.english || '-'}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border border-outline-variant/10 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-secondary">12th Grade</CardTitle>
            <GraduationCap className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-primary mb-2">{profile?.twelfthGrade?.percentage || 'N/A'}%</div>
            <p className="text-sm text-on-surface-variant font-medium">
              Maths: {profile?.twelfthGrade?.maths || '-'}% • Physics: {profile?.twelfthGrade?.physics || '-'}% • Chemistry: {profile?.twelfthGrade?.chemistry || '-'}%
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-bold font-headline text-primary mb-4 mt-12">Target Job Roles</h3>
      <div className="flex flex-wrap gap-3">
        {profile?.jobRolesPredicted?.map((role, idx) => (
          role && (
            <span key={idx} className="px-4 py-2 bg-secondary-fixed text-on-secondary-fixed-variant text-sm font-bold rounded-xl border border-secondary-fixed-dim/30 hover:-translate-y-0.5 transition-transform cursor-default">
              {role}
            </span>
          )
        ))}
      </div>
    </div>
  );
}
