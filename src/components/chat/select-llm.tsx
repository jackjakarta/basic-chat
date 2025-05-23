'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type AIModelRow } from '@/db/schema';
import { getModelName } from '@/utils/chat';
import { cw } from '@/utils/tailwind';
import { usePathname } from 'next/navigation';

import { useLlmModel } from '../providers/llm-model';

export default function SelectLlmModel({ models }: { models: AIModelRow[] }) {
  const { model, setModel } = useLlmModel();
  const pathname = usePathname();
  const isChatRoute = pathname === '/' || pathname.includes('/c');

  const openaiModels = models.filter((model) => model.provider === 'openai');
  const googleModels = models.filter((model) => model.provider === 'google');
  const anthropicModels = models.filter((model) => model.provider === 'anthropic');
  const mistralModels = models.filter((model) => model.provider === 'mistral');
  const xaiModels = models.filter((model) => model.provider === 'xai');

  return (
    <Select value={model} onValueChange={(value) => setModel(value)}>
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
            Anthropic
          </SelectLabel>
          {anthropicModels.map((model) => (
            <SelectItem key={model.id} value={model.id} className="me-4 cursor-pointer">
              <span className="me-2">{getModelName(model.id)}</span>
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup className="flex flex-col gap-1">
          <SelectLabel className="text-xs -mb-2 mt-2 text-muted-foreground dark:text-secondary-foreground/60">
            Google Gemini
          </SelectLabel>
          {googleModels.map((model) => (
            <SelectItem key={model.id} value={model.id} className="me-4 cursor-pointer">
              <span className="me-2">{getModelName(model.id)}</span>
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup className="flex flex-col gap-1">
          <SelectLabel className="text-xs -mb-2 mt-2 text-muted-foreground dark:text-secondary-foreground/60">
            Mistral
          </SelectLabel>
          {mistralModels.map((model) => (
            <SelectItem key={model.id} value={model.id} className="me-4 cursor-pointer">
              <span className="me-2">{getModelName(model.id)}</span>
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup className="flex flex-col gap-1">
          <SelectLabel className="text-xs -mb-2 mt-2 text-muted-foreground dark:text-secondary-foreground/60">
            xAI
          </SelectLabel>
          {xaiModels.map((model) => (
            <SelectItem key={model.id} value={model.id} className="me-4 cursor-pointer">
              <span className="me-2">{getModelName(model.id)}</span>
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup className="flex flex-col gap-1">
          <SelectLabel className="text-xs -mb-2 mt-2 text-muted-foreground dark:text-secondary-foreground/60">
            OpenAI
          </SelectLabel>
          {openaiModels.map((model) => (
            <SelectItem key={model.id} value={model.id} className="me-4 cursor-pointer">
              <span className="me-2">{getModelName(model.id)}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
