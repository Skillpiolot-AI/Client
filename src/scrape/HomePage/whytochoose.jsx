import React from 'react'
import { Brain, Users, GraduationCap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="flex flex-col items-center text-center border border-border shadow-md transition-all duration-300 hover:shadow-lg group relative overflow-hidden">
      <div className=" inset-0 bg-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
      <CardHeader className="relative z-1000 w-full">
        <div className="flex justify-center items-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function WhyChooseUs() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Why choose us?</h2>
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
          <svg className="w-full h-24" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path
              d="M0,50 Q250,0 500,50 T1000,50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="8,8"
              className="text-muted"
            />
          </svg>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <FeatureCard
            icon={<Brain className="w-12 h-12 text-primary" />}
            title="AI Powered Career Roadmaps"
            description="Personalized roadmaps tailored to your goals. Customized quizzes to identify strengths and weaknesses."
          />
          <FeatureCard
            icon={<Users className="w-12 h-12 text-primary" />}
            title="Mentorship"
            description="AI mentor for solving real-time doubts and queries, with human mentors for further guidance."
          />
          <FeatureCard
            icon={<GraduationCap className="w-12 h-12 text-primary" />}
            title="High Quality Resources"
            description="A comprehensive data-driven approach to career planning."
          />
        </div>
      </div>
    </div>
  )
}