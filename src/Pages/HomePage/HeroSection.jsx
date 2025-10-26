import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Rocket, BookOpen, Users } from 'lucide-react'
import ChatBot from '../../Bots/chatbot'

export default function HeroSection() {
  const navigate = useNavigate()
  const careerOptions = [
    { title: "RoadMap", desc: "Generate your career pathway", link: "/combinedquiz", icon: Rocket },
    { title: "Mentorship", desc: "Book a session with Mentor", link: "/mentorship", icon: BookOpen },
    { title: "Community", desc: "Gather insights from Experts", link: "/community", icon: Users },
  ]
  const handleRedirect = () => {
    navigate('/combinedquiz')
  }
  
  const handleCardClick = (link) => {
    navigate(link)
  }
  return (
    <div className="bg-gradient-to-br from-background to-secondary/10 min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Unlock Your Career Potential
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Explore global opportunities to learn, showcase skills, and get hired.
          </p>
          <div className="flex justify-center mb-6">
            <div className="flex -space-x-4 mr-4">
              <Avatar className="w-10 h-10 border-2 border-background">
                <AvatarImage src="/boy.png" alt="Avatar" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <Avatar className="w-10 h-10 border-2 border-background">
                <AvatarImage src="/human.png" alt="Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar className="w-10 h-10 border-2 border-background">
                <AvatarImage src="/hacker.png" alt="Avatar" />
                <AvatarFallback>TS</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-muted-foreground self-center">Join 1000+ professionals</span>
          </div>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleRedirect}
          >
            Get Started
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {careerOptions.map((option, index) => (
            <Card 
              key={index} 
              className="bg-secondary/10 cursor-pointer transition-all duration-300 hover:bg-secondary/20 hover:scale-105 hover:shadow-lg"
              onClick={() => handleCardClick(option.link)}
            >
              <CardHeader className="p-4">
                <CardTitle className="flex items-center text-lg text-foreground">
                  <option.icon className="h-6 w-6 mr-2" />
                  <span>{option.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{option.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    
    </div>
  )
}