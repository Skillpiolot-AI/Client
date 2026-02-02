import React from 'react'
import Dashboard from './HomePage/HeroSection'
import ImageCarousel from './HomePage/ImageCarousel'
import AskMentor from './HomePage/AskMentor'
import FAQSection from './HomePage/FAQ'
import WhyChooseUs from './HomePage/whytochoose'
import MentorSupport from './HomePage/MentorSupport'

function Home() {
  return (
    <div>
      <Dashboard/>
      <MentorSupport/>
      <WhyChooseUs/>
    </div>
  )
}

export default Home
