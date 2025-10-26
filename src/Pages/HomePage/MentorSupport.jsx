
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export default function MentorSupport() {
  const navigate = useNavigate(); // Initialize navigate

  const handleFindMentorClick = () => {
    navigate('/mentorship'); // Redirect to /mentorship
  };

  return (
    <div className="bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-bold">
            <span className="text-primary">Personalised</span> Mentor Support
          </h2>
          <Button variant="link" className="text-primary hover:text-primary/80">
            View More →
          </Button>
        </div>
        <p className="text-xl text-muted-foreground mb-8">
          Select a mentor from a pool of 2000+ industry experts & get 1-on-1 mentorship!
        </p>
        <div className="flex space-x-4 mb-8">
          <Button onClick={handleFindMentorClick}>
            <Search className="w-4 h-4 mr-2" />
            Find a Mentor
          </Button>
          <Button variant="outline">
            Become a Mentor
          </Button>
        </div>
        <Card className="relative overflow-hidden rounded-xl border border-border">
          <img
            src="/12.jpg"
            alt="Mentor and mentee shaking hands"
            className="w-full object-cover"
          />
          <div className="absolute right-4 bottom-4 flex space-x-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Mentor 4" />
                <AvatarFallback>M4</AvatarFallback>
              </Avatar>
              <span className="font-bold">G</span>
              <span className="text-primary">★ 4.5</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Mentor 5" />
                <AvatarFallback>M5</AvatarFallback>
              </Avatar>
              <span className="font-bold">a</span>
              <span className="text-primary">★ 5.0</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Mentor 6" />
                <AvatarFallback>M6</AvatarFallback>
              </Avatar>
              <span className="font-bold">🍎</span>
              <span className="text-primary">★ 4.8</span>
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
