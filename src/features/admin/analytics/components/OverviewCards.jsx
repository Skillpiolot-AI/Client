
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Activity, 
  TrendingUp,
  Clock,
  Eye
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function OverviewCards({ overview, timeframe }) {
  if (!overview) return null;

  const getTimeframLabel = (timeframe) => {
    switch(timeframe) {
      case '24h': return '24 Hours';
      case 'week': return 'Week';
      case 'month': return 'Month';
      case 'year': return 'Year';
      default: return 'Period';
    }
  };

  const cards = [
    {
      title: 'Total Users',
      value: overview.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: null,
      description: 'All registered users'
    },
    {
      title: `New Users (${getTimeframLabel(timeframe)})`,
      value: overview.newUsers?.[timeframe === '24h' ? 'last24h' : timeframe === 'week' ? 'lastWeek' : timeframe === 'month' ? 'lastMonth' : 'lastYear'] || 0,
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12%',
      description: 'Recently joined users'
    },
    {
      title: `Active Users (${getTimeframLabel(timeframe)})`,
      value: overview.activeUsers?.[timeframe === '24h' ? 'last24h' : timeframe === 'week' ? 'lastWeek' : timeframe === 'month' ? 'lastMonth' : 'lastYear'] || 0,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+8%',
      description: 'Users who logged in'
    },
    {
      title: `Total Activities (${getTimeframLabel(timeframe)})`,
      value: overview.totalActivities?.[timeframe === '24h' ? 'last24h' : timeframe === 'week' ? 'lastWeek' : timeframe === 'month' ? 'lastMonth' : 'lastYear'] || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+15%',
      description: 'All user interactions'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {card.value.toLocaleString()}
                  </div>
                  {card.change && (
                    <div className="text-sm text-green-600 font-medium">
                      {card.change}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
