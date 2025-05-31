import { type SubscriptionLimits } from '@/db/schema';
import { UserAndContext } from '@/utils/auth';

export type ExtentedUser = UserAndContext & {
  tokensUsed: number;
  avatarUrl: string;
  limits: SubscriptionLimits;
};
