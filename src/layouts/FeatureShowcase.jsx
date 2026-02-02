"use client"

import { useState, useEffect, useRef } from "react"

function FeatureCard({ title, description, isActive, progress, onClick }) {
  return (
    <div
      className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 ${
        isActive
          ? "bg-white shadow-[0px_0px_0px_0.75px_#E0DEDB_inset]"
          : "border-l-0 border-r-0 md:border border-[#E0DEDB]/80"
      }`}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[rgba(50,45,43,0.08)]">
          <div
            className="h-full bg-[#322D2B] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="self-stretch flex justify-center flex-col text-[#49423D] text-sm md:text-sm font-semibold leading-6 md:leading-6 font-sans">
        {title}
      </div>
      <div className="self-stretch text-[#605A57] text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px] font-sans">
        {description}
      </div>
    </div>
  )
}

function DecorativePattern() {
  return (
    <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
        />
      ))}
    </div>
  )
}

export default function FeatureShowcase() {
  const [activeCard, setActiveCard] = useState(0)
  const [progress, setProgress] = useState(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (!mountedRef.current) return

      setProgress((prev) => {
        if (prev >= 100) {
          if (mountedRef.current) {
            setActiveCard((current) => (current + 1) % 3)
          }
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => {
      clearInterval(progressInterval)
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleCardClick = (index) => {
    if (!mountedRef.current) return
    setActiveCard(index)
    setProgress(0)
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[960px] pt-4 pb-10 px-6 lg:px-11 flex flex-col justify-center items-center gap-2 my-16 mb-0 lg:pb-0">
        <div className="w-full h-[450px] lg:h-[695.55px] bg-white shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] overflow-hidden rounded-lg flex flex-col justify-start items-start">
          <div className="self-stretch flex-1 flex justify-start items-start">
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full overflow-hidden">
                <div
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    activeCard === 0 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"
                  }`}
                >
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dsadsadsa.jpg-xTHS4hGwCWp2H5bTj8np6DXZUyrxX7.jpeg"
                    alt="Mentor Booking Dashboard"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    activeCard === 1 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"
                  }`}
                >
                  <img
                    src="/analytics-dashboard-with-charts-graphs-and-data-vi.jpg"
                    alt="RIASEC Assessment Dashboard"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    activeCard === 2 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"
                  }`}
                >
                  <img
                    src="/data-visualization-dashboard-with-interactive-char.jpg"
                    alt="Learning & Workshops Dashboard"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-[#E0DEDB] border-b border-[#E0DEDB] flex justify-center items-start">
        <div className="w-12 self-stretch relative overflow-hidden">
          <DecorativePattern />
        </div>

        <div className="flex-1 max-w-[1060px] flex flex-col md:flex-row justify-center items-stretch gap-0">
          <FeatureCard
            title="Book Your Mentor"
            description="Browse and book verified mentors matched to your goals and interests."
            isActive={activeCard === 0}
            progress={activeCard === 0 ? progress : 0}
            onClick={() => handleCardClick(0)}
          />
          <FeatureCard
            title="RIASEC Assessment"
            description="Discover your ideal career path through AI-powered RIASEC personality assessment."
            isActive={activeCard === 1}
            progress={activeCard === 1 ? progress : 0}
            onClick={() => handleCardClick(1)}
          />
          <FeatureCard
            title="Learn & Explore"
            description="Access skill courses, roadmaps, and workshops in India and worldwide."
            isActive={activeCard === 2}
            progress={activeCard === 2 ? progress : 0}
            onClick={() => handleCardClick(2)}
          />
        </div>

        <div className="w-12 self-stretch relative overflow-hidden">
          <DecorativePattern />
        </div>
      </div>
    </div>
  )
}