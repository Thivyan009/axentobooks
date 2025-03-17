"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BarChart3, Layout, Settings, Users } from "lucide-react"

interface WelcomeScreenProps {
  title: string
  description: string
  onNext: () => void
}

export function WelcomeScreen({ title, description, onNext }: WelcomeScreenProps) {
  const features = [
    {
      icon: Layout,
      title: "Intuitive Dashboard",
      description: "Everything you need, right where you need it",
    },
    {
      icon: BarChart3,
      title: "Powerful Analytics",
      description: "Gain insights from your data with beautiful visualizations",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with your team",
    },
    {
      icon: Settings,
      title: "Customizable",
      description: "Tailor the application to fit your specific needs",
    },
  ]

  return (
    <div className="space-y-8 p-4 md:p-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
      </motion.div>

      <motion.div
        className="grid gap-4 md:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-full bg-primary/10 p-2">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button size="lg" onClick={onNext} className="group">
          Let's Get Started
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </div>
  )
}

