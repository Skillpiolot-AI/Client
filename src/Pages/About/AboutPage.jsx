import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Rocket, Shield, Globe, Award } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { label: 'Active Mentors', value: '500+' },
    { label: 'Mentees Guided', value: '10k+' },
    { label: 'Communities', value: '50+' },
    { label: 'Success Rate', value: '95%' },
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8 text-indigo-500" />,
      title: 'Our Mission',
      description: 'To democratize high-quality career guidance and mentorship for students and professionals worldwide.',
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-500" />,
      title: 'Community First',
      description: 'We believe in the power of shared knowledge. Our reddit-style communities foster peer-to-peer learning.',
    },
    {
      icon: <Rocket className="w-8 h-8 text-orange-500" />,
      title: 'Accelerated Growth',
      description: 'Through personalized roadmaps and 1:1 sessions, we help you skip the trial and error phase of your career.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-[#F9F8F7] text-[#2F3037] pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
              Empowering the Next Generation of Tech Leaders
            </h1>
            <p className="text-xl text-[rgba(49,45,43,0.80)] max-w-3xl mx-auto">
              SkillPilot is more than just a platform. It's an ecosystem where ambition meets experience, and curiosity finds its direction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-[rgba(55,50,47,0.12)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-[rgba(49,45,43,0.60)] uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why SkillPilot?</h2>
            <div className="w-20 h-1 bg-indigo-500 mx-auto rounded-full"></div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-10"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl shadow-sm border border-[rgba(55,50,47,0.08)] hover:shadow-md transition-shadow group"
              >
                <div className="mb-6 p-3 bg-[#F9F8F7] w-fit rounded-xl group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-[rgba(49,45,43,0.80)] leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-6">Built by Mentors, for the Community</h2>
              <div className="space-y-4 text-[rgba(49,45,43,0.80)] text-lg leading-relaxed">
                <p>
                  We started with a simple observation: the gap between academic learning and industry expectations is widening every year. While tutorials are everywhere, guidance is rare.
                </p>
                <p>
                  SkillPilot was born to bridge this gap. We brought together top-tier engineers, designers, and managers from companies like Google, Meta, and NVIDIA to share their expertise directly with you.
                </p>
                <p>
                  Today, we are a thriving ecosystem of curious minds who don't just want to learn—they want to excel.
                </p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="aspect-video bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white">
                <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center">
                   <Globe className="w-32 h-32 text-indigo-500/20" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-500 rounded-lg text-white">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold">Trusted by 100+ Companies</div>
                      <div className="text-sm opacity-60">Global recognition from top tech giants</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#2F3037] text-white p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full -ml-32 -mb-32"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-8 relative z-10">Ready to Pilot Your Career?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button 
                className="px-8 py-4 bg-white text-[#2F3037] rounded-full font-bold hover:bg-gray-100 transition-colors"
                onClick={() => window.location.href = '/signup'}
              >
                Join the Community
              </button>
              <button 
                className="px-8 py-4 bg-transparent border-2 border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-colors"
                onClick={() => window.location.href = '/mentors'}
              >
                Find a Mentor
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
