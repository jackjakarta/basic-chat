'use client';

import {
  anthropicModelsSchema,
  googleModelsSchema,
  openaiModelsSchema,
} from '@/app/api/chat/schemas';
import { type AIModel } from '@/app/api/chat/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getModelName } from '@/utils/chat';
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
        <SelectGroup className="flex flex-col gap-1">
          <SelectLabel className="text-xs -mb-2 text-muted-foreground dark:text-secondary-foreground/60">
            OpenAI
          </SelectLabel>
          {openaiModelsSchema.options.map((model) => (
            <SelectItem key={model} value={model} className="me-4 cursor-pointer">
              <span className="me-2">{getModelName(model)}</span>
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup className="flex flex-col gap-1">
          <SelectLabel className="text-xs -mb-2 mt-2 text-muted-foreground dark:text-secondary-foreground/60">
            Anthropic
          </SelectLabel>
          {anthropicModelsSchema.options.map((model) => (
            <SelectItem key={model} value={model} className="me-4 cursor-pointer">
              <span className="me-2">{getModelName(model)}</span>
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup className="flex flex-col gap-1">
          <SelectLabel className="text-xs -mb-2 mt-2 text-muted-foreground dark:text-secondary-foreground/60">
            Google Gemini
          </SelectLabel>
          {googleModelsSchema.options.map((model) => (
            <SelectItem key={model} value={model} className="me-4 cursor-pointer">
              <span className="me-2">{getModelName(model)}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
