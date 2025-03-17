"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, HelpCircle } from "lucide-react"

interface InteractiveTutorialProps {
  title: string
  description: string
  steps: { instruction: string; target: string }[]
  onNext: () => void
  onBack: () => void
}

export function InteractiveTutorial({ title, description, steps, onNext, onBack }: InteractiveTutorialProps) {
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // Simulate completing a step
  const completeStep = (index: number) => {
    if (!completedSteps.includes(index)) {
      setCompletedSteps([...completedSteps, index])
    }

    if (index < steps.length - 1) {
      setCurrentTutorialStep(index + 1)
    } else {
      // All steps completed
      setTimeout(() => {
        onNext()
      }, 1000)
    }
  }

  // Demo UI elements for the interactive tutorial
  const demoElements = [
    <div key="create-new" id="create-new" className="w-full">
      <Button className="w-full" onClick={() => completeStep(0)}>
        Create New
      </Button>
    </div>,
    <div key="template-list" id="template-list" className="w-full">
      <Card>
        <CardContent className="p-4">
          <h4 className="mb-2 font-medium">Select a Template</h4>
          <div className="grid grid-cols-2 gap-2">
            {["Basic", "Advanced", "Pro", "Custom"].map((template) => (
              <Button key={template} variant="outline" onClick={() => completeStep(1)}>
                {template}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>,
    <div key="form-fields" id="form-fields" className="w-full">
      <Card>
        <CardContent className="space-y-4 p-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input type="text" className="mt-1 w-full rounded-md border p-2" placeholder="Enter name" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea className="mt-1 w-full rounded-md border p-2" placeholder="Enter description" rows={3} />
          </div>
          <Button onClick={() => completeStep(2)} className="w-full">
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>,
    <div key="save-button" id="save-button" className="w-full">
      <Button onClick={() => completeStep(3)} className="w-full">
        Save
      </Button>
    </div>,
  ]

  return (
    <div className="grid gap-6 p-4 md:grid-cols-5 md:p-6">
      <motion.div
        className="space-y-4 md:col-span-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="mt-1 text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card
                className={
                  currentTutorialStep === index
                    ? "border-primary"
                    : completedSteps.includes(index)
                      ? "border-green-500"
                      : ""
                }
              >
                <CardContent className="flex items-start gap-3 p-4">
                  {completedSteps.includes(index) ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                  ) : currentTutorialStep === index ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    >
                      <HelpCircle className="mt-0.5 h-5 w-5 text-primary" />
                    </motion.div>
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border text-xs">
                      {index + 1}
                    </div>
                  )}
                  <div>
                    <p
                      className={`font-medium ${
                        currentTutorialStep === index
                          ? "text-primary"
                          : completedSteps.includes(index)
                            ? "text-green-500"
                            : ""
                      }`}
                    >
                      {step.instruction}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col items-center justify-center space-y-4 rounded-lg border bg-card p-4 md:col-span-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTutorialStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {demoElements[currentTutorialStep]}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

