import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

export function PdfPasswordInstructions() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          How to remove PDF password?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove PDF Password Protection</DialogTitle>
          <DialogDescription>
            Follow these steps to remove password protection from your PDF using Google Chrome:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open the password-protected PDF in Google Chrome</li>
            <li>Enter the password when prompted</li>
            <li>
              Click on Print:
              <ul className="list-disc list-inside ml-4 mt-1 text-muted-foreground">
                <li>Windows: Press Ctrl + P</li>
                <li>Mac: Press Cmd + P</li>
              </ul>
            </li>
            <li>Select "Save as PDF" as the printer</li>
            <li>Click Save, and the new PDF will be password-free</li>
          </ol>
          <p className="text-sm text-muted-foreground">
            After removing the password, you can upload the new PDF file to the system.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
} 