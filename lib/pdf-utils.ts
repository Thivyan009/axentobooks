import { exec } from "node:child_process"
import { promisify } from "node:util"
import { writeFile, readFile, unlink } from "node:fs/promises"
import { join } from "node:path"
import { tmpdir } from "node:os"

const execAsync = promisify(exec)

export async function removePdfPassword(
  filePath: string,
  password: string,
  outputPath?: string
): Promise<boolean> {
  try {
    console.log("Starting PDF password removal process...")
    console.log("File path:", filePath)
    console.log("Output path:", outputPath || "Not specified (will use temp file)")

    // If no output path is provided, use a temporary file
    const finalOutputPath = outputPath || join(tmpdir(), `temp_${Date.now()}.pdf`)

    // Get the absolute path to the Python script and virtual environment
    const scriptPath = join(process.cwd(), "scripts", "remove_pdf_password.py")
    const venvPython = join(process.cwd(), "venv", "bin", "python3")

    console.log("Script path:", scriptPath)
    console.log("Python interpreter path:", venvPython)

    // Execute the Python script using the virtual environment's Python
    const { stdout, stderr } = await execAsync(
      `"${venvPython}" "${scriptPath}" "${filePath}" "${password}" "${finalOutputPath}"`
    )

    // Log stderr output (this contains our debug messages)
    if (stderr) {
      console.log("Python script debug output:", stderr)
    }

    // Parse the result
    const result = JSON.parse(stdout)

    if (!result.success) {
      console.error("Error removing PDF password:", result.message)
      return false
    }

    console.log("Successfully processed PDF, handling file operations...")

    // If we're using a temporary file, read it and replace the original
    if (!outputPath) {
      console.log("Reading decrypted content from temporary file...")
      const decryptedContent = await readFile(finalOutputPath)
      console.log("Writing decrypted content to original file...")
      await writeFile(filePath, decryptedContent)
      console.log("Cleaning up temporary file...")
      await unlink(finalOutputPath)
    }

    console.log("PDF password removal completed successfully")
    return true
  } catch (error) {
    console.error("Error in removePdfPassword:", error)
    return false
  }
} 