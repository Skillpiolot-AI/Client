import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function AskMentor() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100/50 to-transparent">
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-2">Ask Mentor Anything</h1>
        <p className="text-center text-gray-600 mb-8">
          Get answers from our mentors in the forum. They're here to help with your questions about your career.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ask your questions here</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input placeholder="Our mentors are here to help. Directly submit your questions or doubts to them..." />
              <Button>Ask a question</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {mentors.map((mentor, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={mentor.avatar} />
                    <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{mentor.name}</CardTitle>
                    <p className="text-sm text-gray-600">{mentor.title}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">{mentor.question}</h3>
                <p className="text-gray-600">{mentor.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

const mentors = [
  {
    name: "Mohammad Owaiz Shaik",
    title: "Working Professional",
    avatar: "/placeholder.svg?height=40&width=40",
    question: "How do I become a cloud engineer?",
    answer: "To become a cloud engineer, you can follow these steps: Obtain a relevant degree or certification: Consider pursuing a degree in computer science, information technology, or a related field. Alternatively, you can acquire certifications like AWS Certified Solutions Architect or Microsoft Certified: Azure Solutions Architect. Gain experience with cloud technologies: Familiarize yourself with popular cloud platforms like Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP). Learn about cloud computing concepts, virtualization, networking, and storage. Develop programming and scripting skills: Learn programming languages commonly used in cloud environments...",
  },
  {
    name: "Bhavya Kalra",
    title: "Working Professional",
    avatar: "/placeholder.svg?height=40&width=40",
    question: "What is the in demand skill to know these days in IT industry?",
    answer: "The IT industry is constantly evolving, and the demand for specific skills can vary depending on the current trends and technologies. However, several skills are consistently in high demand across the IT industry. Here are some of the in-demand skills in the IT industry today: 1. Cloud Computing: Proficiency in cloud computing platforms like Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP) is highly sought after. Companies are increasingly adopting cloud-based infrastructure, and professionals with expertise in cloud services, migration, and management are in high demand. 2. Artificial Intelligence (AI) and Machine Learning (ML): AI and ML...",
  },
  {
    name: "Niyati Kapoor",
    title: "Working Professional",
    avatar: "/placeholder.svg?height=40&width=40",
    question: "How to transition from Software development to Data Analytics domain?",
    answer: "The strategy for this is to showcase how well have you worked on technologies that are common in both domains like Python and SQL and also learn new data analysis dashboards like PowerBI or Tableau. You can start as a data analyst and then it is completely upto you whether you want to move into data science roles, ML related roles or continue as a data analyst itself.",
  },
]