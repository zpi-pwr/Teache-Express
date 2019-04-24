import {PubSub} from 'graphql-subscriptions';
import {withFilter} from 'graphql-subscriptions';
import Conversation from './models/conversation'
import Message from './models/message'
import User from './models/user'

const pubsub = new PubSub();

export const resolvers = {
    Query: {
        conversation: (root, {id}) => {
            return Conversation.findById(id);
        },
        conversations: () => {
            return Conversation.find({})
        },
        searchConversation: (root, {search}) => {
            return Conversation.find(
                {
                    $and: [
                        {name: {"$regex": search.name, "$options": "i"}},
                        {tags: {"$in": search.tags}}
                    ]
                },
            );
        }
    },
    Mutation: {
        addConversation: (root, {conversation}) => {
            const conv = new Conversation({
                name: conversation.name,
                description: conversation.description,
                tags: conversation.tags,
                avatar: conversation.avatar,
                contributorsIds: conversation.contributorsIds
            });
            return conv.save();
        },
        addMessage: (root, {message}) => {
            const mssg = new Message({
                id_conversation: message.id_conversation,
                id_sender: message.id_sender,
                content: message.content,
                date: new Date().toISOString()
            });
            pubsub.publish(
                'messageAdded',
                {messageAdded: mssg, id_conversation: message.id_conversation}
            );
            console.log("Message received");
            return mssg.save();
        },
    },
    Subscription: {
        messageAdded: {
            subscribe: withFilter(() => pubsub.asyncIterator('messageAdded'), (payload, variables) => {
                return payload.id_conversation === variables.id_conversation;
            }),
        },
    },
    Conversation: {
        messages(parent, args, ctx, info) {
            return Message.find({id_conversation: {$in: parent.id}})
        },
        contributors(parent, args, ctx, info) {
            return User.find({_id: {$in: parent.contributorsIds}})
        }
    }
};
