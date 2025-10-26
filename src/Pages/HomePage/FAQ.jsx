
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQSection() {
  return (
    <div className="min-h-screen bg-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none"></div>
      <div className="relative z-10 container mx-auto p-6 max-w-4xl flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-8 text-center">
          Find answers to commonly asked questions about Long Term Mentorship
        </p>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Does Long-term mentorship really produce outcomes?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4">
                1:1 Long-term mentorship is a new concept in comparison to a typical course or a bootcamp.
                Hence, your doubt is completely valid. So let's us resolve your doubt with Preplaced mentor stats
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Avg. 90% of mentees say they became more consistent with the help of 1:1 long-term mentorship (Compared to a 10% completion rate of courses)</li>
                <li>Avg. 70% of mentees achieve their career aspirations with the power of 1:1 long-term mentorship (Compared to 30% of people who get success)</li>
              </ul>
              <p className="mb-2">
                Nothing is more powerful than 1:1 long-term mentorship when it comes to delivering results💪.
              </p>
              <p>
                Working with an elite mentor who has been there done that simply transforms your career.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What should be the duration of my long-term mentorship?</AccordionTrigger>
            <AccordionContent>
              The duration of long-term mentorship can vary depending on your goals and needs. Typically, it can range from 3 to 12 months or even longer. It's best to discuss this with your potential mentor to determine the most suitable duration for your specific situation.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How many sessions can I have with the mentor?</AccordionTrigger>
            <AccordionContent>
              The number of sessions can vary based on the mentorship program and your agreement with the mentor. Generally, you might have weekly or bi-weekly sessions. Some programs offer flexibility in scheduling sessions as needed. It's important to clarify this with your mentor or the mentorship program coordinator.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>When is the right time to take long-term mentorship?</AccordionTrigger>
            <AccordionContent>
              The right time for long-term mentorship depends on your career stage and goals. It can be beneficial when you're looking to advance in your career, switch industries, start a new venture, or face significant challenges in your professional life. Anytime you feel you need guidance and support to achieve your career objectives can be the right time to seek long-term mentorship.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}