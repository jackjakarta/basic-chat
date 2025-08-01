'use client';

import AlertDialog from '@/components/common/alert-modal';
import { useToast } from '@/components/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type AssistantRow } from '@/db/schema';
import { MoreHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { deleteAssistantAction } from '../[assistantId]/actions';

export default function AssistantCard({ assistant }: { assistant: AssistantRow }) {
  const t = useTranslations('assistants');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const { toastSuccess, toastError, toastLoading } = useToast();

  async function handleDeleteAssistant(e: React.MouseEvent) {
    e.preventDefault();
    toastLoading(t('toasts.toast-delete-loading'));

    try {
      await deleteAssistantAction({
        assistantId: assistant.id,
        vectorStoreId: assistant.vectorStoreId,
      });
      setIsDeleteModalOpen(false);
      toastSuccess(t('toasts.toast-delete-success'));
      router.refresh();
    } catch (error) {
      console.error({ error });
      toastError(t('toasts.toast-delete-error'));
    }
  }

  return (
    <>
      <Link href={`/assistants/${assistant.id}/c`}>
        <Card className="flex w-full cursor-pointer items-center justify-between space-x-4 border-none p-4 shadow-none hover:bg-sidebar/50 dark:bg-secondary/40 dark:hover:bg-secondary/20">
          <div className="flex flex-1 items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={assistant.pictureUrl ?? undefined} alt={assistant.name} />
              <AvatarFallback>{assistant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col space-y-1">
              <h3 className="font-medium leading-none">{assistant.name}</h3>
              <p className="max-w-[180px] truncate text-sm text-muted-foreground sm:max-w-[110px] lg:max-w-[270px]">
                {assistant.instructions}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/assistants/${assistant.id}`}>
                <DropdownMenuItem className="cursor-pointer">{tCommon('edit')}</DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setIsDeleteModalOpen(true);
                }}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                {tCommon('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>
      </Link>

      <AlertDialog
        isOpen={isDeleteModalOpen}
        onOpenChange={() => {
          setIsDeleteModalOpen((prev) => !prev);
        }}
        title={t('confirmation.delete.title')}
        description={t('confirmation.delete.description').replace(
          '$ASSISTANT_NAME',
          assistant.name,
        )}
        onConfirm={handleDeleteAssistant}
        type="destructive"
      />
    </>
  );
}
