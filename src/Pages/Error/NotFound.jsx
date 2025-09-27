'use client'

import { Link } from 'react-router-dom'; // Adjusted import
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Compass className="h-24 w-24 text-primary mb-8" />
      </motion.div>
      <motion.h1
        className="mb-4 text-4xl font-bold text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        404 - Page Not Found
      </motion.h1>
      <motion.p
        className="mb-8 text-xl text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Oops! It seems you've ventured into uncharted territory.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button asChild>
          <Link to="/">
            <Compass className="mr-2 h-4 w-4" />
            Navigate Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
