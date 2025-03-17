"use client"

import { useCallback, useState } from "react"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import React from "react"

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  email: z
    .string()
    .min(1, { message: "This field cannot be empty." })
    .email("This is not a valid email."),
  company: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters." })
    .max(50, { message: "Company name must not be longer than 50 characters." }),
  role: z
    .string()
    .min(2, { message: "Role must be at least 2 characters." })
    .max(50, { message: "Role must not be longer than 50 characters." })
    .optional(),
  bio: z
    .string()
    .max(160, { message: "Bio must not be longer than 160 characters." })
    .optional(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const defaultValues: Partial<AccountFormValues> = {
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    company: session?.user?.company || "",
    role: session?.user?.role || "",
    bio: session?.user?.bio || "",
  }

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  React.useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        email: session.user.email || "",
        company: session.user.company || "",
        role: session.user.role || "",
        bio: session.user.bio || "",
      })
    }
  }, [session, form])

  const onSubmit = async (data: AccountFormValues) => {
    setIsLoading(true)

    try {
      const { email, ...updateData } = data

      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          ...updateData,
        },
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Reset any previous errors
      setPreviewImage(null)

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or GIF file.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (2MB)
      const maxSize = 2 * 1024 * 1024 // 2MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Image size should be less than 2MB.",
          variant: "destructive",
        })
        return
      }

      // Show preview immediately
      try {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewImage(reader.result as string)
        }
        reader.onerror = () => {
          toast({
            title: "Preview Error",
            description: "Failed to generate image preview.",
            variant: "destructive",
          })
        }
        reader.readAsDataURL(file)
      } catch (previewError) {
        console.error("Preview error:", previewError)
        toast({
          title: "Preview Error",
          description: "Failed to generate image preview.",
          variant: "destructive",
        })
        return
      }

      setImageLoading(true)

      try {
        const formData = new FormData()
        formData.append("file", file)

        console.log('Uploading file:', {
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024).toFixed(2)}KB`
        })

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to upload image")
        }

        if (!data.image) {
          throw new Error("No image URL received from server")
        }

        // Update session with new image
        const updatedSession = {
          ...session,
          user: {
            ...session?.user,
            image: data.image,
          },
        }

        await update(updatedSession)

        // Clear preview since we now have the actual image
        setPreviewImage(null)

        toast({
          title: "Success",
          description: "Profile photo updated successfully.",
        })
      } catch (error) {
        console.error("Upload error:", error)
        setPreviewImage(null)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to upload profile photo. Please try again.",
          variant: "destructive",
        })
      } finally {
        setImageLoading(false)
        // Reset the input value to allow uploading the same file again
        e.target.value = ''
      }
    },
    [session, toast, update]
  )

  const handleRemovePhoto = async () => {
    setImageLoading(true)
    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove photo")
      }

      const updatedSession = {
        ...session,
        user: {
          ...session?.user,
          image: null,
        },
      }

      await update(updatedSession)
      
      setPreviewImage(null)

      toast({
        title: "Success",
        description: "Profile photo removed successfully.",
      })
    } catch (error) {
      console.error("Remove photo error:", error)
      toast({
        title: "Error",
        description: "Failed to remove profile photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setImageLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Update your account settings and manage your profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {(previewImage || session?.user?.image) ? (
                <AvatarImage 
                  src={previewImage || session?.user?.image || null}
                  alt={session?.user?.name || "Profile picture"}
                />
              ) : (
                <AvatarFallback className="text-lg">
                  {session?.user?.name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-1.5">
              <Label htmlFor="picture">Profile photo</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative"
                  disabled={imageLoading}
                >
                  {imageLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.upload className="mr-2 h-4 w-4" />
                  )}
                  Upload
                  <input
                    id="picture"
                    type="file"
                    accept="image/png,image/jpeg,image/gif"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                    disabled={imageLoading}
                  />
                </Button>
                {(session?.user?.image || previewImage) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemovePhoto}
                    disabled={imageLoading}
                    className="text-destructive hover:text-destructive"
                  >
                    {imageLoading ? (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.trash className="mr-2 h-4 w-4" />
                    )}
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Upload a new profile photo. Supported formats: JPG, PNG, or GIF (max 2MB).
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your full name from the onboarding process.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your email address" 
                      {...field} 
                      disabled 
                      className="bg-muted"
                    />
                  </FormControl>
                  <FormDescription>
                    Your email address cannot be changed as it is used for authentication.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your company name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your company name from the onboarding process.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your role" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can write up to 160 characters about yourself.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

