import { type SubscriptionLimits } from '@/db/schema';
import { type UserAndContext } from '@/utils/auth';

type UserStats = {
  tokensUsed: number;
  conversationsCount: number | undefined;
  conversationMessagesCount: number | undefined;
};

export type ExtendedUser = UserAndContext &
  UserStats & {
    avatarUrl: string;
    limits: SubscriptionLimits;
  };
