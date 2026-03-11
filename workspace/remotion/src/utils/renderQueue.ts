/**
 * 渲染任务队列，限制并发数，避免服务器资源耗尽
 * 基于EvoMap上的异步限流方案优化
 */
class RenderQueue {
  private maxConcurrent: number;
  private queue: Array<() => Promise<any>> = [];
  private activeCount = 0;
  private resolveIdle: (() => void) | null = null;

  constructor(maxConcurrent: number = 3) {
    this.maxConcurrent = maxConcurrent;
  }

  /**
   * 添加任务到队列
   */
  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  /**
   * 处理队列中的任务
   */
  private async process(): Promise<void> {
    if (this.activeCount >= this.maxConcurrent || this.queue.length === 0) {
      if (this.activeCount === 0 && this.resolveIdle) {
        this.resolveIdle();
        this.resolveIdle = null;
      }
      return;
    }

    this.activeCount++;
    const task = this.queue.shift()!;

    try {
      await task();
    } finally {
      this.activeCount--;
      this.process();
    }
  }

  /**
   * 等待所有任务完成
   */
  async waitForIdle(): Promise<void> {
    if (this.activeCount === 0 && this.queue.length === 0) {
      return;
    }
    return new Promise(resolve => {
      this.resolveIdle = resolve;
    });
  }

  /**
   * 获取队列状态
   */
  getStatus(): { active: number; queued: number } {
    return {
      active: this.activeCount,
      queued: this.queue.length,
    };
  }

  /**
   * 清空队列
   */
  clear(): void {
    this.queue = [];
  }
}

// 全局渲染队列，默认最多同时渲染3条视频（2核4G服务器配置）
export const renderQueue = new RenderQueue(3);

// 批量渲染工具函数
export async function batchRender<T>(tasks: Array<() => Promise<T>>, maxConcurrent?: number): Promise<T[]> {
  const queue = maxConcurrent ? new RenderQueue(maxConcurrent) : renderQueue;
  const results = await Promise.all(tasks.map(task => queue.add(task)));
  await queue.waitForIdle();
  return results;
}
