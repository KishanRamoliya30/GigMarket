import User from '@/app/models/user';
import plans from '@/app/models/plans';
export async function setFreePlanToUser(user: typeof User.prototype): Promise<void> {
  const freePlan = await plans.findOne({ type: 1, price: 0 });

  if (freePlan) {
    user.subscription = {
      status: 'active',
      subscriptionId: null,
      planId: freePlan._id,
      planName: freePlan.name,
      planType: freePlan.type,
      cancelAtPeriodEnd: false,
    };
    user.subscriptionCompleted = true;
  } else {
    user.subscription = {
      status: 'cancelled',
      subscriptionId: null,
      planId: null,
      planName: null,
      planType: null,
      cancelAtPeriodEnd: false,
    };
    user.subscriptionCompleted = false;
  }

  await user.save();
}
