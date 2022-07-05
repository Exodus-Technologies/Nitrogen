import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  getSubscriptionStatus,
  deleteSubscriptionById
} from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

exports.getSubscriptions = async query => {
  try {
    const subscriptions = await getSubscriptions(query);
    if (subscriptions) {
      return [
        200,
        {
          message: 'Successful fetch for subscription with query params.',
          subscriptions: subscriptions.items,
          total: subscriptions.total
        }
      ];
    }
    return badRequest(`No subscriptions found with selected query params.`);
  } catch (err) {
    console.log('Error getting all subscriptions: ', err);
    return badImplementationRequest('Error getting subscriptions.');
  }
};

exports.createSubscription = async payload => {
  try {
    const [error, subscription] = await createSubscription(payload);
    if (subscription) {
      return [
        200,
        {
          message: 'Successful creation of subscription.',
          subscription
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log('Error creating subscription: ', err);
    return badImplementationRequest('Error creating subscription.');
  }
};

exports.updateSubscription = async payload => {
  try {
    const [error, subscription] = await updateSubscription(payload);
    if (subscription) {
      return [
        200,
        {
          message: 'Successful update of subscription.',
          subscription
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log('Error creating subscription: ', err);
    return badImplementationRequest('Error creating subscription.');
  }
};

exports.getSubscriptionStatus = async query => {
  try {
    const [subscriptionStatusObject] = await getSubscriptionStatus(query);
    if (subscriptionStatusObject) {
      return [200, subscriptionStatusObject];
    }
  } catch (err) {
    console.log('Error getting remaining time on subscription: ', err);
    return badImplementationRequest(
      'Error getting remaining time on subscription.'
    );
  }
};

exports.deleteSubscriptionById = async subscriptionId => {
  try {
    const deletedSubscription = await deleteSubscriptionById(subscriptionId);
    if (deletedSubscription) {
      return [204];
    }
    return badRequest(`No subscription found with id provided.`);
  } catch (err) {
    console.log('Error deleting subscription by id: ', err);
    return badImplementationRequest('Error deleting subscription by id.');
  }
};
