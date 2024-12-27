import { db } from './firebase-config.js';
import { collection, addDoc, query, where, getDocs, orderBy, doc, updateDoc, arrayUnion, limitToLast } from 'firebase/firestore';

export class ConversationService {
    constructor(userId) {
        if (!userId) throw new Error('userId is required');
        this.userId = userId;
        this.currentConversationId = null;
    }

    async startNewConversation() {
        try {
            const conversation = {
                userId: this.userId,
                startTime: new Date(),
                messages: [],
                lastUpdated: new Date()
            };

            const docRef = await addDoc(collection(db, 'conversations'), conversation);
            this.currentConversationId = docRef.id;
            return docRef.id;
        } catch (error) {
            console.error('Error starting new conversation:', error);
            throw error;
        }
    }

    async addMessage(role, content) {
        try {
            if (!this.currentConversationId) {
                console.error('No active conversation');
                return;
            }

            if (!role || !content) {
                console.error('Role and content are required');
                return;
            }

            const conversationRef = doc(db, 'conversations', this.currentConversationId);
            await updateDoc(conversationRef, {
                messages: arrayUnion({
                    role,
                    content,
                    timestamp: new Date()
                }),
                lastUpdated: new Date()
            });
        } catch (error) {
            console.error('Error adding message:', error);
            throw error;
        }
    }

    async getPreviousConversations(maxResults = 5) {
        const conversationsRef = collection(db, 'conversations');
        const q = query(
            conversationsRef,
            where('userId', '==', this.userId),
            orderBy('lastUpdated', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const conversations = [];
        
        let count = 0;
        querySnapshot.forEach((doc) => {
            if (count < maxResults) {
                conversations.push({
                    id: doc.id,
                    ...doc.data()
                });
                count++;
            }
        });

        return conversations;
    }

    async generateContextFromHistory() {
        try {
            const previousConversations = await this.getPreviousConversations();
            if (!previousConversations.length) {
                return '';
            }

            let context = "Previous conversations summary:\n";

            previousConversations.forEach((conv) => {
                if (conv.startTime && typeof conv.startTime.toDate === 'function') {
                    context += "\nConversation from " + conv.startTime.toDate().toLocaleDateString() + ":\n";
                }
                if (Array.isArray(conv.messages)) {
                    conv.messages.forEach((msg) => {
                        if (msg.role && msg.content) {
                            context += `${msg.role}: ${msg.content}\n`;
                        }
                    });
                }
            });

            return context;
        } catch (error) {
            console.error('Error generating context:', error);
            return '';
        }
    }
} 