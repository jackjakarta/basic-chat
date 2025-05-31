import { SubscriptionLimits } from '@/stripe/subscription';
import { UserAndContext } from '@/utils/auth';

export type ExtentedUser = UserAndContext & {
  tokensUsed: number;
  avatarUrl: string;
  limits: SubscriptionLimits;
};
