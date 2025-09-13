'use client';

import { insertContactFormSubmissionAction } from '@/app/actions';
import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { contactFormSchema } from '@/utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Mail, MessageSquare, Send, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type ContactFormData = z.infer<typeof contactFormSchema>;

type ContactFormProps = {
  trigger?: React.ReactNode;
};

export default function ContactForm({ trigger }: ContactFormProps) {
  const { toastSuccess, toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  async function onSubmit(data: ContactFormData) {
    try {
      await insertContactFormSubmissionAction(data);
      toastSuccess('Thank you for contacting us! We will get back to you soon.');
      reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toastError('There was an error submitting the form. Please try again later.');
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger ?? <Button type="button">Contact Us</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[725px]" aria-describedby={undefined}>
        <VisuallyHidden>
          <DialogTitle>Contact Us</DialogTitle>
        </VisuallyHidden>
        <Card className="border-0">
          <CardHeader className="pb-6 text-center">
            <CardTitle className="text-2xl font-bold text-primary-foreground">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-1/2 space-y-2">
                  <Label
                    htmlFor="name"
                    className="flex items-center gap-2 font-semibold text-primary-foreground"
                  >
                    <User className="h-4 w-4" />
                    Name
                  </Label>
                  <Input
                    {...register('name')}
                    onChange={() => {
                      if (errors.name || errors.root) {
                        clearErrors();
                      }
                    }}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    className="border-border transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="w-1/2 space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2 font-semibold text-primary-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    {...register('email')}
                    onChange={() => {
                      if (errors.email || errors.root) {
                        clearErrors();
                      }
                    }}
                    id="email"
                    name="email"
                    placeholder="email@example.com"
                    className="border-border transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="flex items-center gap-2 font-semibold text-primary-foreground"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Label>
                <Textarea
                  {...register('message')}
                  onChange={() => {
                    if (errors.message || errors.root) {
                      clearErrors();
                    }
                  }}
                  id="message"
                  name="message"
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  className="resize-none border-border transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-accent"
                />
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  // variant="outline"
                  className="flex w-full items-center justify-center gap-2 bg-accent py-3 font-semibold text-accent-foreground transition-all duration-200 hover:bg-accent/90"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
