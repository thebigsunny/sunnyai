export class RateLimit {
    constructor(maxRequests = 60, timeWindow = 60000) {
        this.requests = new Map();
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
    }

    isAllowed(userId) {
        const now = Date.now();
        const userRequests = this.requests.get(userId) || [];
        
        // Remove old requests
        const recentRequests = userRequests.filter(time => now - time < this.timeWindow);
        
        if (recentRequests.length >= this.maxRequests) {
            return false;
        }
        
        recentRequests.push(now);
        this.requests.set(userId, recentRequests);
        return true;
    }
} 