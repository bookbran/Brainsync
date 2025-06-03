import React, { useState } from 'react';
import { 
  Calendar, 
  Coffee, 
  Heart, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Award,
  RefreshCw,
  Brain
} from 'lucide-react';

const SundayPlanningSection = () => {
  const [activeTab, setActiveTab] = useState<'before' | 'during' | 'after'>('before');

  const beforeContent = {
    title: "Sunday Scaries Mode",
    description: "The real ADHD Sunday overwhelm",
    items: [
      { icon: <Brain />, text: "Overwhelmed by all the competing priorities and draining people to deal with", mood: "😵‍💫" },
      { icon: <Clock />, text: "Already feeling behind before the week even starts", mood: "😰" },
      { icon: <Heart />, text: "Anxious about energy depletion from having to 'perform' all week", mood: "😞" },
      { icon: <Coffee />, text: "Executive function paralysis: too many decisions, not enough bandwidth", mood: "🤯" }
    ],
    bgClass: "bg-gradient-to-br from-red-100 to-orange-100",
    borderClass: "border-red-300"
  };

  const duringContent = {
    title: "BrainSync Sunday Flow",
    description: "AI-guided planning that actually works",
    items: [
      { icon: <Award />, text: "Celebrate last week's wins (planned AND unplanned!)", mood: "🎉" },
      { icon: <RefreshCw />, text: "Discover patterns: How did things actually get done?", mood: "🤔" },
      { icon: <Brain />, text: "Use that wisdom to plan next week smarter", mood: "💡" },
      { icon: <Heart />, text: "Build in flexibility and self-compassion", mood: "💚" }
    ],
    bgClass: "bg-gradient-to-br from-green-100 to-emerald-100",
    borderClass: "border-green-300"
  };

  const afterContent = {
    title: "Energized & Confident",
    description: "Ready for the week with realistic optimism",
    items: [
      { icon: <CheckCircle />, text: "DONE list from last week fills you with pride", mood: "🏆" },
      { icon: <TrendingUp />, text: "Next week's plan feels achievable and exciting", mood: "🚀" },
      { icon: <Sparkles />, text: "Permission to adapt and change plans as needed", mood: "✨" },
      { icon: <Star />, text: "Sunday feels like a gift, not a chore", mood: "🌟" }
    ],
    bgClass: "bg-gradient-to-br from-blue-100 to-indigo-100",
    borderClass: "border-blue-300"
  };

  const getContent = () => {
    switch(activeTab) {
      case 'before': return beforeContent;
      case 'during': return duringContent;
      case 'after': return afterContent;
      default: return beforeContent;
    }
  };

  const content = getContent();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>Sunday Planning Transformation</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            From Sunday Scaries to 
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Sunday Celebration</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI transforms Sunday planning from overwhelming anxiety into energizing self-discovery. 
            <strong className="text-gray-800"> Celebrate what you've accomplished, learn from how you actually work, 
            and plan with flexibility built in.</strong>
          </p>
        </div>

        {/* Tab Navigation with Transformation Flow */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-50 rounded-3xl p-8 inline-flex flex-col items-center space-y-6 shadow-lg">
            {/* Transformation Arrow */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl mb-2">😰</div>
                <p className="text-sm font-medium text-gray-700">Sunday Anxiety</p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <div className="text-center">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-sm font-medium text-gray-700">Celebration & Wisdom</p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <p className="text-sm font-medium text-gray-700">Energized Planning</p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="bg-white rounded-full p-1 inline-flex space-x-1 shadow-lg">
              {[
                { key: 'before', label: 'Before', icon: <Coffee className="w-4 h-4" />, color: 'from-red-500 to-orange-500' },
                { key: 'during', label: 'BrainSync Flow', icon: <Brain className="w-4 h-4" />, color: 'from-green-500 to-emerald-600' },
                { key: 'after', label: 'After', icon: <Sparkles className="w-4 h-4" />, color: 'from-blue-500 to-indigo-600' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'before' | 'during' | 'after')}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="max-w-4xl mx-auto">
          <div className={`${content.bgClass} rounded-3xl p-8 lg:p-12 border-2 ${content.borderClass} shadow-xl transition-all duration-500`}>
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h3>
              <p className="text-lg text-gray-700">{content.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {content.items.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 flex items-start space-x-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 h-32"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    activeTab === 'before' ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white' :
                    activeTab === 'during' ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' :
                    'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 flex justify-between items-start">
                    <p className="text-gray-800 font-medium flex-1">{item.text}</p>
                    <div className="text-4xl ml-4">{item.mood}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SundayPlanningSection; 