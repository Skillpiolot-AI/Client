// 'use client'

// import { Link } from 'react-router-dom'; // Adjusted import
// import { motion } from 'framer-motion';
// import { Button } from "@/components/ui/button";
// import { Compass } from 'lucide-react';

// export default function NotFound() {
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Compass className="h-24 w-24 text-primary mb-8" />
//       </motion.div>
//       <motion.h1
//         className="mb-4 text-4xl font-bold text-primary"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.2, duration: 0.5 }}
//       >
//         404 - Page Not Found
//       </motion.h1>
//       <motion.p
//         className="mb-8 text-xl text-muted-foreground"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.4, duration: 0.5 }}
//       >
//         Oops! It seems you've ventured into uncharted territory.
//       </motion.p>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.6, duration: 0.5 }}
//       >
//         <Button asChild>
//           <Link to="/">
//             <Compass className="mr-2 h-4 w-4" />
//             Navigate Home
//           </Link>
//         </Button>
//       </motion.div>
//     </div>
//   );
// }


export default function RetroTV404() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex items-center justify-center w-full max-w-xl p-8">
        {/* Main Container */}
        <div className="relative flex flex-col items-center mt-20">
          {/* Antenna */}
          <div className="relative w-20 h-20 rounded-full border-2 border-black bg-orange-500 -mb-24 z-0">
            {/* Antenna Shadow */}
            <div className="absolute w-12 h-14 ml-7 rounded-[45%] rotate-[140deg] border-4 border-transparent shadow-[inset_0px_16px_#a85103,inset_0px_16px_1px_1px_#a85103]" />
            
            {/* Antenna decorations */}
            <div className="absolute -mt-36 ml-2 -rotate-[25deg] w-4 h-2 rounded-full bg-orange-300" />
            <div className="absolute mt-1 ml-5 -rotate-[20deg] w-6 h-3 rounded-full bg-orange-300" />
            
            {/* Antenna arms */}
            <div className="absolute -top-[102%] -left-[130%] w-48 h-[5.5em] rounded-[50px] bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-800 -rotate-[29deg]" 
                 style={{clipPath: 'polygon(50% 0%, 49% 100%, 52% 100%)'}} />
            <div className="absolute -top-[211%] -left-[35%] rotate-45 w-2 h-2 rounded-full border-2 border-black bg-gray-400 z-50" />
            
            <div className="absolute -top-[210%] -left-[10%] w-48 h-16 rounded-[50px] bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-800 -rotate-[8deg]"
                 style={{clipPath: 'polygon(47% 0, 47% 0, 34% 34%, 54% 25%, 32% 100%, 29% 96%, 49% 32%, 30% 38%)'}} />
            <div className="absolute -top-[294%] left-[94%] w-2 h-2 rounded-full border-2 border-black bg-gray-400 z-50" />
          </div>

          {/* TV Body */}
          <div className="relative w-[17em] h-36 mt-12 rounded-2xl bg-orange-600 border-2 border-neutral-900 shadow-[inset_0.2em_0.2em_#e69635] flex justify-center">
            {/* TV Texture Overlay */}
            <div className="absolute w-full h-full rounded-2xl opacity-10 pointer-events-none"
                 style={{
                   background: 'repeating-radial-gradient(#d36604 0 0.0001%, #00000070 0 0.0002%) 50% 0/2500px 2500px, repeating-conic-gradient(#d36604 0 0.0001%, #00000070 0 0.0002%) 60% 60%/2500px 2500px',
                   backgroundBlendMode: 'difference'
                 }} />

            {/* Corner SVG */}
            <svg className="absolute mt-1 -ml-1 h-3 w-3" viewBox="0 0 189.929 189.929">
              <path d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13 C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z" />
            </svg>

            {/* Screen Container */}
            <div className="flex items-center justify-center rounded-2xl shadow-[3.5px_3.5px_0px_#e69635]">
              <div className="w-44 h-[7.75em] flex items-center justify-center rounded-xl">
                {/* Static Screen - Hidden on mobile */}
                <div className="hidden lg:flex w-52 h-[7.85em] items-center justify-center rounded-xl border-2 border-neutral-900 font-bold text-neutral-800 tracking-widest text-center animate-pulse"
                     style={{
                       background: 'repeating-radial-gradient(#000 0 0.0001%, #ffffff 0 0.0002%) 50% 0/2500px 2500px, repeating-conic-gradient(#000 0 0.0001%, #ffffff 0 0.0002%) 60% 60%/2500px 2500px',
                       backgroundBlendMode: 'difference'
                     }}>
                  <span className="bg-black text-white px-1 py-0.5 text-xs rounded z-10">NOT FOUND</span>
                </div>

                {/* Color Bars Screen - Visible on mobile */}
                <div className="flex lg:hidden w-52 h-[7.85em] items-center justify-center rounded-xl border-2 border-black font-bold text-neutral-800 tracking-widest text-center overflow-hidden relative"
                     style={{
                       background: 'linear-gradient(to right, #002fc6 0%, #002bb2 14.29%, #3a3a3a 14.29%, #303030 28.57%, #ff0afe 28.57%, #f500f4 42.86%, #6c6c6c 42.86%, #626262 57.14%, #0affd9 57.14%, #00f5ce 71.43%, #3a3a3a 71.43%, #303030 85.71%, white 85.71%, #fafafa 100%)'
                     }}>
                  <div className="absolute left-0 top-0 w-full h-[68.48%] z-0"
                       style={{
                         background: 'linear-gradient(to right, white 0%, #fafafa 14.29%, #ffe60a 14.29%, #f5dc00 28.57%, #0affd9 28.57%, #00f5ce 42.86%, #10ea00 42.86%, #0ed600 57.14%, #ff0afe 57.14%, #f500f4 71.43%, #ed0014 71.43%, #d90012 85.71%, #002fc6 85.71%, #002bb2 100%)'
                       }} />
                  <div className="absolute left-0 bottom-0 w-full h-[21.74%] z-0"
                       style={{
                         background: 'linear-gradient(to right, #006c6b 0%, #005857 16.67%, white 16.67%, #fafafa 33.33%, #001b75 33.33%, #001761 50%, #6c6c6c 50%, #626262 66.67%, #929292 66.67%, #888888 83.33%, #3a3a3a 83.33%, #303030 100%)'
                       }} />
                  <span className="bg-black text-white px-1 py-0.5 text-xs rounded z-10">NOT FOUND</span>
                </div>
              </div>
            </div>

            {/* Lines decoration */}
            <div className="absolute bottom-0 right-16 flex gap-0.5 mb-0">
              <div className="w-0.5 h-2 bg-black rounded-t-full mt-2" />
              <div className="w-0.5 h-4 bg-black rounded-t-full" />
              <div className="w-0.5 h-2 bg-black rounded-t-full mt-2" />
            </div>

            {/* Control Panel */}
            <div className="absolute right-0 top-0 w-[4.25em] h-32 bg-orange-400 border-2 border-neutral-900 rounded-xl p-2.5 flex flex-col items-center justify-center gap-3 shadow-[3px_3px_0px_#e69635]">
              {/* Knob 1 */}
              <div className="relative w-7 h-7 rounded-full bg-amber-900 border-2 border-black shadow-[inset_2px_2px_1px_#b49577,-2px_0px_#513721,-2px_0px_0px_1px_black]">
                <div className="absolute mt-4 ml-2 rotate-45 w-0.5 h-6 bg-black rounded" />
                <div className="absolute mt-4 ml-2 rotate-45 w-0.5 h-2 bg-black rounded" />
                <div className="absolute mt-3.5 ml-3 rotate-45 w-0.5 h-2.5 bg-black rounded" />
              </div>

              {/* Knob 2 */}
              <div className="relative w-7 h-7 rounded-full bg-amber-900 border-2 border-black shadow-[inset_2px_2px_1px_#b49577,-2px_0px_#513721,-2px_0px_0px_1px_black]">
                <div className="absolute -mt-0.5 ml-2.5 -rotate-45 w-0.5 h-6 bg-black rounded" />
                <div className="absolute mt-4 ml-3 -rotate-45 w-0.5 h-2 bg-black rounded" />
              </div>

              {/* Speakers */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-900 border-2 border-black shadow-[inset_1.25px_1.25px_1px_#b49577]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-900 border-2 border-black shadow-[inset_1.25px_1.25px_1px_#b49577]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-900 border-2 border-black shadow-[inset_1.25px_1.25px_1px_#b49577]" />
                </div>
                <div className="w-full h-0.5 bg-neutral-800" />
                <div className="w-full h-0.5 bg-neutral-800" />
              </div>
            </div>
          </div>

          {/* TV Base */}
          <div className="w-full flex items-center justify-center gap-[8.7em] relative">
            <div className="h-4 w-8 border-2 border-neutral-800 bg-neutral-600 -mt-0.5 z-0" />
            <div className="h-4 w-8 border-2 border-neutral-800 bg-neutral-600 -mt-0.5 z-0" />
            <div className="absolute h-0.5 w-[17.5em] bg-neutral-800 mt-3" />
          </div>
        </div>

        {/* Background 404 Text */}
        <div className="absolute flex flex-row gap-24 z-0 mb-8 items-center justify-center opacity-50 text-neutral-800 font-bold pointer-events-none">
          <div className="transform scale-y-[24.5] scale-x-[9]">4</div>
          <div className="transform scale-y-[24.5] scale-x-[9]">0</div>
          <div className="transform scale-y-[24.5] scale-x-[9]">4</div>
        </div>
      </div>
    </div>
  );
}