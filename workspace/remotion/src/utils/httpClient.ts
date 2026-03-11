import fetch from "node-fetch";

/**
 * 带自动重试的HTTP客户端，解决网络波动导致的渲染失败问题
 * 基于EvoMap上的成熟方案优化
 */
class RetryHttpClient {
  private maxRetries: number;
  private baseDelay: number;
  private maxDelay: number;

  constructor(options: { maxRetries?: number; baseDelay?: number; maxDelay?: number } = {}) {
    this.maxRetries = options.maxRetries ?? 3;
    this.baseDelay = options.baseDelay ?? 500;
    this.maxDelay = options.maxDelay ?? 5000;
  }

  private getBackoffDelay(attempt: number): number {
    // 全抖动指数退避算法，避免重试风暴
    const exp = Math.min(this.baseDelay * Math.pow(2, attempt), this.maxDelay);
    return exp / 2 + Math.random() * exp / 2;
  }

  private async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          timeout: 10000, // 10秒超时
        });

        // 可重试的HTTP状态码
        const retryableStatuses = [429, 500, 502, 503, 504];
        if (response.ok || !retryableStatuses.includes(response.status)) {
          return response;
        }

        // 处理429限流，尊重Retry-After头
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          if (retryAfter) {
            const delay = parseInt(retryAfter, 10) * 1000;
            if (!isNaN(delay)) {
              await this.wait(Math.min(delay, this.maxDelay));
              continue;
            }
          }
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        lastError = error as Error;
        
        // 最后一次重试失败，不再等待
        if (attempt === this.maxRetries) {
          break;
        }

        // 网络错误、超时等可重试的错误
        const retryableErrors = [
          'ECONNRESET',
          'ECONNREFUSED',
          'ETIMEDOUT',
          'EAI_AGAIN',
          'ENOTFOUND',
          'Network request failed',
          'timeout'
        ];

        const errorMessage = (error as Error).message;
        const isRetryable = retryableErrors.some(err => errorMessage.includes(err));
        
        if (!isRetryable) {
          throw error;
        }

        const delay = this.getBackoffDelay(attempt);
        console.log(`⚠️  请求失败，${delay}ms后重试（第${attempt + 1}/${this.maxRetries}次）: ${errorMessage}`);
        await this.wait(delay);
      }
    }

    throw lastError || new Error('请求失败，已超过最大重试次数');
  }

  async get(url: string, options: RequestInit = {}): Promise<Response> {
    return this.fetch(url, { ...options, method: 'GET' });
  }

  async post(url: string, body: any, options: RequestInit = {}): Promise<Response> {
    return this.fetch(url, {
      ...options,
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }
}

// 全局单例
export const httpClient = new RetryHttpClient({
  maxRetries: 3,
  baseDelay: 500,
  maxDelay: 5000,
});
