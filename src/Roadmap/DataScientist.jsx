import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Database, Brain, Briefcase, Clock, ExternalLink } from 'lucide-react';
import { BarChart } from 'lucide-react'; // Correct import

const roadmapData = [
  {
    id: 'foundations',
    label: 'Foundations',
    icon: BookOpen,
    duration: '6-12 months',
    children: [
      {
        id: 'math-stats',
        label: 'Mathematics and Statistics',
        description: 'Build a strong foundation in calculus, linear algebra, probability, and statistics.',
        resources: [
          { name: 'Khan Academy - Statistics and Probability', url: 'https://www.khanacademy.org/math/statistics-probability' },
          { name: 'MIT OpenCourseWare - Linear Algebra', url: 'https://ocw.mit.edu/courses/mathematics/18-06-linear-algebra-spring-2010/' }
        ]
      },
      {
        id: 'programming',
        label: 'Programming Basics',
        description: 'Learn Python and R, focusing on data manipulation and analysis libraries.',
        resources: [
          { name: 'Codecademy - Learn Python', url: 'https://www.codecademy.com/learn/learn-python-3' },
          { name: 'DataCamp - Introduction to R', url: 'https://www.datacamp.com/courses/free-introduction-to-r' }
        ]
      },
      {
        id: 'data-analysis',
        label: 'Data Analysis and Visualization',
        description: 'Master data manipulation, exploratory data analysis, and visualization techniques.',
        resources: [
          { name: 'Coursera - Data Analysis with Python', url: 'https://www.coursera.org/learn/data-analysis-with-python' },
          { name: 'FreeCodeCamp - Data Analysis with Python Certification', url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/' }
        ]
      }
    ]
  },
  {
    id: 'core-skills',
    label: 'Core Data Science Skills',
    icon: Database,
    duration: '12-18 months',
    children: [
      {
        id: 'machine-learning',
        label: 'Machine Learning Fundamentals',
        description: 'Learn core ML algorithms, model evaluation, and feature engineering.',
        resources: [
          { name: 'Coursera - Machine Learning by Andrew Ng', url: 'https://www.coursera.org/learn/machine-learning' },
          { name: 'Fast.ai - Practical Deep Learning for Coders', url: 'https://course.fast.ai/' }
        ]
      },
      {
        id: 'data-engineering',
        label: 'Data Engineering Basics',
        description: 'Understand data storage, processing, and ETL pipelines.',
        resources: [
          { name: 'Udacity - Data Engineering Nanodegree', url: 'https://www.udacity.com/course/data-engineer-nanodegree--nd027' },
          { name: 'DataCamp - Data Engineer with Python', url: 'https://www.datacamp.com/tracks/data-engineer-with-python' }
        ]
      },
      {
        id: 'sql-databases',
        label: 'SQL and Databases',
        description: 'Master SQL and understand relational database concepts.',
        resources: [
          { name: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial/' },
          { name: 'Stanford Database Course', url: 'https://online.stanford.edu/courses/soe-ydatabases-databases' }
        ]
      },
      {
        id: 'big-data',
        label: 'Big Data Technologies',
        description: 'Learn Hadoop, Spark, and distributed computing concepts.',
        resources: [
          { name: 'Coursera - Big Data Specialization', url: 'https://www.coursera.org/specializations/big-data' },
          { name: 'DataBricks - Apache Spark Tutorial', url: 'https://databricks.com/spark/tutorial' }
        ]
      }
    ]
  },
  {
    id: 'advanced-techniques',
    label: 'Advanced Techniques',
    icon: Brain,
    duration: '18-24 months',
    children: [
      {
        id: 'deep-learning',
        label: 'Deep Learning',
        description: 'Master neural networks, CNNs, RNNs, and advanced architectures.',
        resources: [
          { name: 'Coursera - Deep Learning Specialization', url: 'https://www.coursera.org/specializations/deep-learning' },
          { name: 'MIT Deep Learning Course', url: 'http://introtodeeplearning.com/' }
        ]
      },
      {
        id: 'nlp',
        label: 'Natural Language Processing',
        description: 'Learn text processing, sentiment analysis, and language models.',
        resources: [
          { name: 'Stanford CS224N: NLP with Deep Learning', url: 'http://web.stanford.edu/class/cs224n/' },
          { name: 'Coursera - NLP Specialization', url: 'https://www.coursera.org/specializations/natural-language-processing' }
        ]
      },
      {
        id: 'computer-vision',
        label: 'Computer Vision',
        description: 'Understand image processing, object detection, and image generation.',
        resources: [
          { name: 'Coursera - Computer Vision Specialization', url: 'https://www.coursera.org/specializations/computervision' },
          { name: 'PyImageSearch University', url: 'https://www.pyimagesearch.com/pyimagesearch-university/' }
        ]
      },
      {
        id: 'reinforcement-learning',
        label: 'Reinforcement Learning',
        description: 'Explore RL algorithms, Markov decision processes, and Q-learning.',
        resources: [
          { name: 'Coursera - Reinforcement Learning Specialization', url: 'https://www.coursera.org/specializations/reinforcement-learning' },
          { name: 'OpenAI Spinning Up', url: 'https://spinningup.openai.com/en/latest/' }
        ]
      }
    ]
  },
  {
    id: 'specialized-skills',
    label: 'Specialized Skills',
    icon: BarChart,
    duration: 'Ongoing',
    children: [
      {
        id: 'mlops',
        label: 'MLOps',
        description: 'Learn model deployment, monitoring, and maintenance in production.',
        resources: [
          { name: 'Coursera - Machine Learning Engineering for Production', url: 'https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops' },
          { name: 'Google Cloud - MLOps Guides', url: 'https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning' }
        ]
      },
      {
        id: 'explainable-ai',
        label: 'Explainable AI',
        description: 'Understand techniques for interpreting and explaining ML models.',
        resources: [
          { name: 'edX - Explainable AI', url: 'https://www.edx.org/course/explainable-ai' },
          { name: 'SHAP (SHapley Additive exPlanations)', url: 'https://github.com/slundberg/shap' }
        ]
      },
      {
        id: 'data-ethics',
        label: 'Data Ethics and Fairness',
        description: 'Learn about bias in AI, ethical considerations, and fairness metrics.',
        resources: [
          { name: 'Coursera - Data Ethics and AI', url: 'https://www.coursera.org/learn/data-ethics' },
          { name: 'MIT - Ethics of AI', url: 'https://www.media.mit.edu/courses/the-ethics-of-ai/' }
        ]
      },
      {
        id: 'domain-expertise',
        label: 'Domain Expertise',
        description: 'Develop expertise in specific industries (e.g., finance, healthcare, marketing).',
        resources: [
          { name: 'Coursera - AI for Medicine Specialization', url: 'https://www.coursera.org/specializations/ai-for-medicine' },
          { name: 'edX - FinTech', url: 'https://www.edx.org/course/fintech' }
        ]
      }
    ]
  },
  {
    id: 'career-growth',
    label: 'Career Growth',
    icon: Briefcase,
    duration: '5+ years',
    children: [
      {
        id: 'junior-ds',
        label: 'Junior Data Scientist',
        description: 'Apply foundational skills, assist in projects, and learn from senior team members.',
        duration: '0-2 years'
      },
      {
        id: 'mid-level-ds',
        label: 'Mid-level Data Scientist',
        description: 'Lead small to medium-sized projects, mentor junior team members.',
        duration: '2-5 years'
      },
      {
        id: 'senior-ds',
        label: 'Senior Data Scientist',
        description: 'Lead complex projects, make strategic decisions, and guide team direction.',
        duration: '5+ years'
      },
      {
        id: 'specialized-roles',
        label: 'Specialized Roles',
        description: 'Transition to roles like ML Engineer, AI Researcher, or Chief Data Scientist.',
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

const DetailedDataScientistRoadmap = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
        {[...Array(36)].map((_, i) => (
          <div key={i} className="border-gray-200 border-r border-b"></div>
        ))}
      </div>
      
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Detailed Data Scientist Roadmap</h1>
        <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg">
          {roadmapData.map((node, index) => (
            <RoadmapNode key={node.id} node={node} index={index} totalNodes={roadmapData.length} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedDataScientistRoadmap;