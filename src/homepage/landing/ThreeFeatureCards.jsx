export default function ThreeFeatureCards() {
  const cards = [
    {
      title: "AI Career Recommendation",
      description:
        "Get personalized career path suggestions powered by advanced AI algorithms that analyze your skills and interests.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
            fill="currentColor"
          />
        </svg>
      ),
      link: "/assesmentinfo"
    },
    {
      title: "Connect with Mentors",
      description:
        "Build meaningful relationships with industry experts and experienced professionals who can guide your career journey.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            fill="currentColor"
          />
        </svg>
      ),
      link: "/mentors"
    },
    {
      title: "See Colleges",
      description:
        "Explore and compare colleges that match your academic goals and career aspirations with detailed insights.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6.18L23 9 12 3z" fill="currentColor" />
        </svg>
      ),
      link: "/colleges"
    },
  ]

  const handleRedirect = (url) => {
    window.location.href = url;
  }

  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      {/* Header Section */}
      <div className="w-full max-w-[1060px] py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[616px] px-4 sm:px-6 py-4 sm:py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
          <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
            <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="7" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="1" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="7" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
              </svg>
            </div>
            <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
              Features
            </div>
          </div>
          <div className="w-full text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Your Path to Success Starts Here
          </div>
          <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
            Discover powerful tools designed to accelerate your career growth
            <br />
            and connect you with the right opportunities and mentors.
          </div>
        </div>
      </div>

      {/* Three Cards Grid */}
      <div className="w-full flex justify-center items-start">
        <div className="w-12 self-stretch relative overflow-hidden">
          {/* Left decorative pattern */}
          <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 max-w-[1060px] grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`p-6 sm:p-8 md:p-10 flex flex-col justify-start items-start gap-4 sm:gap-6 border-b md:border-b-0 ${
                index < 2 ? "md:border-r" : ""
              } border-[rgba(55,50,47,0.12)] hover:bg-[rgba(55,50,47,0.02)] transition-colors duration-300`}
            >
              {/* Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[rgba(55,50,47,0.08)] flex items-center justify-center text-[#37322F]">
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">{card.title}</h3>

              {/* Description */}
              <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                {card.description}
              </p>

              {/* CTA Button */}
              <div className="mt-auto pt-4">
                <button
                  onClick={() => handleRedirect(card.link)}
                  className="text-[#37322F] text-sm font-semibold leading-5 font-sans hover:text-[#49423D] transition-colors duration-200 flex items-center gap-2 bg-transparent border-none cursor-pointer p-0"
                >
                  Learn more
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-12 self-stretch relative overflow-hidden">
          {/* Right decorative pattern */}
          <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}