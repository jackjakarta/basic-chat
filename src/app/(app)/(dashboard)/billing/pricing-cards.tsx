'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type SubscriptionPlanRow } from '@/db/schema';
import { convertCentAmountToEuro } from '@/utils/money';
import { Check, Infinity, MessageSquare, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function PricingCards({ plans }: { plans: SubscriptionPlanRow[] }) {
  const router = useRouter();
  const t = useTranslations('billing.cards');

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`relative border-2 transition-all hover:shadow-lg ${
            plan.id === 'premium' ? 'border-blue-500 shadow-md' : 'border-muted-foreground'
          }`}
        >
          {plan.id === 'premium' && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
              <Badge className="bg-blue-600 px-4 py-1">{t('recommended')}</Badge>
            </div>
          )}

          <CardHeader className="pb-8 text-center">
            <div className="mb-4 flex items-center justify-center">
              <div
                className={`rounded-full p-3 ${plan.id === 'premium' ? 'bg-blue-100' : 'bg-gray-100'}`}
              >
                {getPlanIcon(plan.id)}
              </div>
            </div>

            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
            <CardDescription className="mt-2 text-gray-600">{plan.description}</CardDescription>

            <div className="mt-6">
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-muted-foreground">
                  ${plan.price > 0 ? convertCentAmountToEuro(plan.price) : '0'}
                </span>
                <span className="ml-2 text-muted-foreground">/{t('month')}</span>
              </div>
              {plan.id === 'free' && (
                <p className="mt-2 text-sm text-muted-foreground">{t('free-forever')}</p>
              )}
              {plan.id === 'premium' && (
                <p className="mt-2 text-sm text-muted-foreground">14 {t('days-trial')}</p>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              className={`w-full ${plan.id === 'premium' ? 'bg-blue-600 hover:bg-blue-700' : 'border-muted-foreground'}`}
              variant={plan.id === 'premium' ? 'default' : 'outline'}
              size="lg"
              onClick={plan.id === 'premium' ? () => router.push('/payment/reactivate') : undefined}
            >
              {plan.id === 'premium' ? 'Start Free Trial' : 'Get Started'}
            </Button>

            <div className="space-y-4">
              <h4 className="font-semibold text-muted-foreground">{t('whats-included')}</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  {plan.limits.messagesLimit === null ? (
                    <Infinity className="h-5 w-5 flex-shrink-0 text-green-500" />
                  ) : (
                    <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                  )}
                  <span className="text-muted-foreground">
                    {formatLimit(plan.limits.messagesLimit, t('messages-month'))}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  {plan.limits.tokenLimit === null ? (
                    <Infinity className="h-5 w-5 flex-shrink-0 text-green-500" />
                  ) : (
                    <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                  )}
                  <span className="text-muted-foreground">
                    {formatLimit(plan.limits.tokenLimit, t('tokens-month'))}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    {plan.id === 'premium' ? t('priority-support') : t('community-support')}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    {plan.id === 'premium' ? t('advanced-features') : t('basic-features')}
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getPlanIcon(planId: string) {
  return planId === 'premium' ? (
    <Zap className="h-6 w-6 text-blue-600" />
  ) : (
    <MessageSquare className="h-6 w-6 text-gray-600" />
  );
}

function formatLimit(limit: number | null, unit: string) {
  if (limit === null) {
    return `Unlimited ${unit}`;
  }
  return `${limit.toLocaleString()} ${unit}`;
}
