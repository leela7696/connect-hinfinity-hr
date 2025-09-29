import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { User, Camera, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function UserProfileManagement() {
  const { profile, updateProfile } = useAuth();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      department: profile?.department || '',
      position: profile?.position || '',
    },
  });

  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your personal information and account settings
            </p>
          </div>

          {/* Profile Overview */}
          <Card className="glass hover-scale">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                    <AvatarFallback className="text-2xl">
                      {profile.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold">{profile.full_name}</h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                    <Badge variant="secondary" className="flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      {profile.role.toUpperCase()}
                    </Badge>
                    {profile.department && (
                      <Badge variant="outline">
                        {profile.department}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 mt-4 text-sm text-muted-foreground">
                    {profile.position && (
                      <div className="flex items-center justify-center md:justify-start">
                        <User className="h-4 w-4 mr-2" />
                        {profile.position}
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-center justify-center md:justify-start">
                        <Phone className="h-4 w-4 mr-2" />
                        {profile.phone}
                      </div>
                    )}
                    <div className="flex items-center justify-center md:justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Member since {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input placeholder="Your department" {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="Your job title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}