'use client';

import { modelsSchema, type AIModel } from '@/app/api/chat/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cw } from '@/utils/tailwind';
import { usePathname } from 'next/navigation';

import { useLlmModel } from '../providers/llm-model';

export default function SelectLlmModel() {
  const { model, setModel } = useLlmModel();
  const pathname = usePathname();
  const isChatRoute = pathname === '/' || pathname.includes('/c');

  return (
    <Select value={model} onValueChange={(value) => setModel(value as AIModel)}>
      <SelectTrigger
        title="Select LLM Model"
        className={cw(
          !isChatRoute && 'invisible',
          'w-auto h-[28px] border-none hover:bg-accent shadow-none focus:ring-0 focus:ring-transparent',
        )}
      >
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {modelsSchema.options.map((model) => (
          <SelectItem key={model} value={model} className="me-4 cursor-pointer">
            <span className="me-2">{model}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
