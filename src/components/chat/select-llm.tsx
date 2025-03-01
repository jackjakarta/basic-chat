'use client';

import { type AIModel } from '@/app/api/chat/models';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname } from 'next/navigation';

import { useLlmModel } from '../providers/llm-model';

export default function SelectLlmModel() {
  const { model, setModel } = useLlmModel();
  const pathname = usePathname();
  const isChatRoute = pathname === '/' || pathname.includes('/c');

  if (!isChatRoute) {
    return null;
  }

  return (
    <Select value={model} onValueChange={(value) => setModel(value as AIModel)}>
      <SelectTrigger
        title="Select LLM Model"
        className="w-auto h-[32px] border-none hover:bg-accent shadow-none focus:ring-0 focus:ring-transparent"
      >
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gpt-4o" className="me-4">
          <span className="me-2">GPT-4o</span>
        </SelectItem>
        <SelectItem value="gpt-4o-mini">
          <span className="me-2">GPT-4o Mini</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
