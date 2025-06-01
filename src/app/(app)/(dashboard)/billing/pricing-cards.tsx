'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type SubscriptionPlanRow } from '@/db/schema';
import { convertCentAmountToEuro } from '@/utils/money';
import { Check, Infinity, MessageSquare, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingCards({ plans }: { plans: SubscriptionPlanRow[] }) {
  const router = useRouter();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`relative border-2 transition-all hover:shadow-lg ${
            plan.id === 'premium' ? 'border-blue-500 shadow-md' : 'border-muted-foreground'
          }`}
        >
          {plan.id === 'premium' && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-600 px-4 py-1">Recommended</Badge>
            </div>
          )}

          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center mb-4">
              <div
                className={`p-3 rounded-full ${plan.id === 'premium' ? 'bg-blue-100' : 'bg-gray-100'}`}
              >
                {getPlanIcon(plan.id)}
              </div>
            </div>

            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
            <CardDescription className="text-gray-600 mt-2">{plan.description}</CardDescription>

            <div className="mt-6">
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-muted-foreground">
                  ${plan.price > 0 ? convertCentAmountToEuro(plan.price) : '0'}
                </span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              {plan.id === 'free' && (
                <p className="text-sm text-muted-foreground mt-2">Forever free</p>
              )}
              {plan.id === 'premium' && (
                <p className="text-sm text-muted-foreground mt-2">14 days free trial</p>
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
              <h4 className="font-semibold text-muted-foreground">What's included:</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  {plan.limits.messagesLimit === null ? (
                    <Infinity className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                  <span className="text-muted-foreground">
                    {formatLimit(plan.limits.messagesLimit, 'messages per month')}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  {plan.limits.tokenLimit === null ? (
                    <Infinity className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                  <span className="text-muted-foreground">
                    {formatLimit(plan.limits.tokenLimit, 'tokens per month')}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {plan.id === 'premium' ? 'Priority support' : 'Community support'}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {plan.id === 'premium' ? 'Advanced features' : 'Basic features'}
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
