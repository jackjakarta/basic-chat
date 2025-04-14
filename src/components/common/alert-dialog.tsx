'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import React from 'react';

import { Button } from '../ui/button';

type AlertType = 'destructive' | 'info';

type AlertModalProps = {
  title: string;
  description: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (e: React.MouseEvent) => void;
  type?: AlertType;
};

export default function AlertModal({
  title,
  onConfirm,
  isOpen,
  onOpenChange,
  description,
  type,
}: AlertModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button onClick={onConfirm} variant={type === 'destructive' ? 'destructive' : 'default'}>
            {type === 'destructive' ? 'Confirm' : 'Ok'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
