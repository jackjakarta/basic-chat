'use client';

import { useToast } from '@/components/hooks/use-toast';
import ConnectIcon from '@/components/icons/connect';
import DisconnectIcon from '@/components/icons/disconnect';
import { type ActiveIntegration } from '@/db/functions/data-source-integrations';
import { DataSourceIntegrationModel } from '@/db/schema';
import { cw } from '@/utils/tailwind';
import { useRouter } from 'next/navigation';
import React from 'react';

import { removeDataSourceIntegrationAction } from './actions';
import { getLoginByDataSourceIntegration, IntegrationIcon } from './utils';

type IntegrationCardProps = DataSourceIntegrationModel & {
  activeIntegration?: ActiveIntegration | undefined;
};

export default function IntegrationCard({
  activeIntegration,
  ...dataSourceIntegration
}: IntegrationCardProps) {
  const { name, state, type, description } = dataSourceIntegration;
  const { toastSuccess, toastError } = useToast();
  const router = useRouter();

  async function handleClick() {
    if (activeIntegration === undefined) {
      const loginData = getLoginByDataSourceIntegration(dataSourceIntegration);

      if (loginData === undefined) {
        toastError('Something went wrong when activating the integration.');
        return;
      }
      window.open(loginData.redirectUri);
      return;
    }

    if (activeIntegration !== undefined) {
      const deleted = await removeDataSourceIntegrationAction({
        dataSourceIntegrationId: dataSourceIntegration.id,
      });

      if (deleted.success) {
        toastSuccess(
          `The integration with ${activeIntegration.name} was successfully disconnected.`,
        );
      } else {
        toastError(
          `Something went wrong with the separation of the ${activeIntegration.name} integration.`,
        );
      }

      router.refresh();
    }
  }

  return (
    <button
      title="Connect/Disconnect with integration"
      className={cw(
        'border-grey-400 grid w-full grid-cols-[auto_1fr_auto] gap-4 rounded-lg border p-4 hover:bg-primary/10',
        state === 'comingSoon' && 'border-grey-600 bg-gray-200',
        state === 'active' && 'group hover:cursor-pointer',
      )}
      onClick={handleClick}
    >
      <IntegrationIcon type={type} />
      <div className="flex flex-col gap-3 text-left">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">{name}</h2>
          {state === 'comingSoon' && (
            <span className="bg-yellow-300 px-1 pt-0.5 text-sm text-[#453A09]">Coming soon</span>
          )}
          {activeIntegration !== undefined && (
            <span className="rounded-lg bg-[#31E38A1A] px-2 py-1 text-sm text-green-600">
              Active
            </span>
          )}
        </div>
        <p className="text-base text-secondary-foreground/70 dark:text-primary-foreground/60">
          {description}
        </p>
      </div>
      {activeIntegration === undefined && <ConnectIcon className="rounded-lg" />}
      {activeIntegration !== undefined && <DisconnectIcon className="rounded-lg" />}
    </button>
  );
}
