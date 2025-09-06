import {
  Bell,
  Book,
  Briefcase,
  Bug,
  Calculator,
  Code,
  Folder,
  MessageSquare,
  Plane,
} from 'lucide-react';
import { z } from 'zod';

export const allowedIconsSchema = z.enum([
  'Chat',
  'Code',
  'Folder',
  'Airplane',
  'Bell',
  'Book',
  'Briefcase',
  'Bug',
  'Calculator',
  'MessageSquare',
]);
export type AllowedIcon = z.infer<typeof allowedIconsSchema>;

export const iconColorSchema = z.enum([
  'grey',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'pink',
  'purple',
]);
export type IconColor = z.infer<typeof iconColorSchema>;

export function getAllowedIcon(icon: AllowedIcon) {
  const iconMap = {
    Chat: MessageSquare,
    Code: Code,
    Folder: Folder,
    Airplane: Plane,
    Bell: Bell,
    Book: Book,
    Briefcase: Briefcase,
    Bug: Bug,
    Calculator: Calculator,
    MessageSquare: MessageSquare,
  };

  return iconMap[icon] ?? Folder;
}
