


import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Code, Terminal, Briefcase, Clock, ExternalLink } from 'lucide-react';

const roadmapData = [
  {
    id: 'high-school',
    label: 'High School (10th-12th)',
    icon: BookOpen,
    duration: '3 years',
    children: [
      {
        id: 'math',
        label: 'Focus on Mathematics',
        description: 'Build a strong foundation in algebra, geometry, and calculus.',
        resources: [
          { name: 'Khan Academy Math', url: 'https://www.khanacademy.org/math' },
          { name: 'MIT OpenCourseWare - High School Math', url: 'https://ocw.mit.edu/high-school/mathematics/' }
        ]
      },
      {
        id: 'cs-intro',
        label: 'Introduction to Computer Science',
        description: 'Learn basic programming concepts and computational thinking.',
        resources: [
          { name: 'Code.org', url: 'https://code.org/' },
          { name: 'CS50 Introduction to Computer Science', url: 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x' }
        ]
      },
      {
        id: 'coding-basics',
        label: 'Learn Coding Basics',
        description: 'Start with Python or JavaScript to understand programming fundamentals.',
        resources: [
          { name: 'Codecademy - Learn Python', url: 'https://www.codecademy.com/learn/learn-python-3' },
          { name: 'freeCodeCamp - JavaScript Algorithms and Data Structures', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/' }
        ]
      },
      {
        id: 'ap-courses',
        label: 'Advanced Placement Courses',
        description: 'Take AP Computer Science A or AP Computer Science Principles if available.',
        resources: [
          { name: 'College Board - AP Computer Science A', url: 'https://apstudents.collegeboard.org/courses/ap-computer-science-a' },
          { name: 'College Board - AP Computer Science Principles', url: 'https://apstudents.collegeboard.org/courses/ap-computer-science-principles' }
        ]
      }
    ]
  },
  {
    id: 'undergraduate',
    label: 'Undergraduate Studies',
    icon: Code,
    duration: '4 years',
    children: [
      {
        id: 'cs-degree',
        label: 'Computer Science Degree',
        description: 'Enroll in a reputable CS program. Focus on core CS subjects and electives.',
        resources: [
          { name: 'Top Computer Science Programs - US News', url: 'https://www.usnews.com/best-graduate-schools/top-science-schools/computer-science-rankings' }
        ]
      },
      {
        id: 'data-structures',
        label: 'Data Structures and Algorithms',
        description: 'Master fundamental CS concepts crucial for problem-solving and interviews.',
        resources: [
          { name: 'Coursera - Data Structures and Algorithms Specialization', url: 'https://www.coursera.org/specializations/data-structures-algorithms' },
          { name: 'LeetCode', url: 'https://leetcode.com/' }
        ]
      },
      {
        id: 'web-dev',
        label: 'Web Development',
        description: 'Learn full-stack web development, including front-end and back-end technologies.',
        resources: [
          { name: 'The Odin Project', url: 'https://www.theodinproject.com/' },
          { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/' }
        ]
      },
      {
        id: 'databases',
        label: 'Databases',
        description: 'Understand database design, SQL, and NoSQL technologies.',
        resources: [
          { name: 'Stanford Database Course', url: 'https://online.stanford.edu/courses/soe-ydatabases-databases' },
          { name: 'MongoDB University', url: 'https://university.mongodb.com/' }
        ]
      },
      {
        id: 'internships',
        label: 'Summer Internships',
        description: 'Gain practical experience through internships at tech companies.',
        resources: [
          { name: 'GitHub - Summer 2024 Internships', url: 'https://github.com/pittcsc/Summer2024-Internships' },
          { name: 'Handshake', url: 'https://joinhandshake.com/' }
        ]
      }
    ]
  },
  {
    id: 'skills-development',
    label: 'Skills Development',
    icon: Terminal,
    duration: 'Ongoing',
    children: [
      {
        id: 'languages',
        label: 'Master Programming Languages',
        description: 'Become proficient in languages like Python, Java, JavaScript, and C++.',
        resources: [
          { name: 'Codecademy', url: 'https://www.codecademy.com/' },
          { name: 'Exercism', url: 'https://exercism.org/' }
        ]
      },
      {
        id: 'frameworks',
        label: 'Learn Popular Frameworks',
        description: 'Explore frameworks like React, Angular, Vue.js, Django, or Spring.',
        resources: [
          { name: 'React Documentation', url: 'https://reactjs.org/docs/getting-started.html' },
          { name: 'Vue.js Guide', url: 'https://vuejs.org/v2/guide/' }
        ]
      },
      {
        id: 'version-control',
        label: 'Version Control (Git)',
        description: 'Master Git for source code management and collaboration.',
        resources: [
          { name: 'Git - Official Documentation', url: 'https://git-scm.com/doc' },
          { name: 'GitHub Learning Lab', url: 'https://lab.github.com/' }
        ]
      },
      {
        id: 'agile',
        label: 'Agile Methodologies',
        description: 'Understand Agile software development practices.',
        resources: [
          { name: 'Agile Alliance', url: 'https://www.agilealliance.org/agile101/' },
          { name: 'Scrum.org', url: 'https://www.scrum.org/resources/what-is-scrum' }
        ]
      },
      {
        id: 'ci-cd',
        label: 'CI/CD',
        description: 'Learn Continuous Integration and Continuous Deployment practices.',
        resources: [
          { name: 'Travis CI Documentation', url: 'https://docs.travis-ci.com/' },
          { name: 'Jenkins User Documentation', url: 'https://www.jenkins.io/doc/' }
        ]
      }
    ]
  },
  {
    id: 'career',
    label: 'Professional Career',
    icon: Briefcase,
    duration: '5+ years',
    children: [
      {
        id: 'entry-level',
        label: 'Entry-level Software Engineer',
        description: 'Start your career, focus on learning from senior developers and improving your skills.',
        duration: '0-2 years'
      },
      {
        id: 'mid-level',
        label: 'Mid-level Software Engineer',
        description: 'Take on more responsibilities, lead small projects, and mentor junior developers.',
        duration: '2-5 years'
      },
      {
        id: 'senior',
        label: 'Senior Software Engineer',
        description: 'Lead major projects, make architectural decisions, and guide team members.',
        duration: '5+ years'
      },
      {
        id: 'specialist',
        label: 'Specialized Roles',
        description: 'Specialize in areas like DevOps, AI/ML, or become a technical lead or architect.',
        duration: 'Varies'
      }
    ]
  },
];

const ResourceLink = ({ resource }) => (
  <a
    href={resource.url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 mr-2 mb-2"
  >
    {resource.name}
    <ExternalLink className="ml-1" size={12} />
  </a>
);

const RoadmapNode = ({ node, index, totalNodes }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  const Icon = node.icon;

  return (
    <div className={`mb-8 transform transition-all duration-500 ease-out ${animated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="flex items-center cursor-pointer p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <Icon className="mr-4 text-blue-500" size={24} />
        <span className="font-bold text-lg">{node.label}</span>
        <div className="ml-auto flex items-center">
          <Clock className="mr-2 text-gray-500" size={16} />
          <span className="text-sm text-gray-500 mr-4">{node.duration}</span>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
      {isOpen && node.children && (
        <div className="mt-4 ml-8 pl-4 border-l-2 border-blue-200">
          {node.children.map((child, childIndex) => (
            <div key={child.id} className={`mb-6 transform transition-all duration-300 ease-out delay-${childIndex * 100} ${animated ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="bg-gray-50 rounded-lg p-4 shadow">
                <h3 className="font-semibold text-lg mb-2">{child.label}</h3>
                {child.description && <p className="text-gray-600 mb-2">{child.description}</p>}
                {child.duration && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Clock size={14} className="mr-1" />
                    <span>{child.duration}</span>
                  </div>
                )}
                {child.resources && (
                  <div className="mt-2">
                    <h4 className="font-medium text-sm mb-1">Resources:</h4>
                    <div className="flex flex-wrap">
                      {child.resources.map((resource, i) => (
                        <ResourceLink key={i} resource={resource} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {index < totalNodes - 1 && (
        <div className="w-px h-8 bg-blue-200 mx-auto mt-4"></div>
      )}
    </div>
  );
};

const DetailedSoftwareEngineerRoadmap = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
        {[...Array(36)].map((_, i) => (
          <div key={i} className="border-gray-200 border-r border-b"></div>
        ))}
      </div>
      
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Detailed Software Engineer Roadmap</h1>
        <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg">
          {roadmapData.map((node, index) => (
            <RoadmapNode key={node.id} node={node} index={index} totalNodes={roadmapData.length} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedSoftwareEngineerRoadmap;