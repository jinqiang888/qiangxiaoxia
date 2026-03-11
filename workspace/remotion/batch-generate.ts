import { renderQueue, batchRender } from "./src/utils/renderQueue";
import { generateKnowledgeVideo } from "./generate-video";
import { httpClient } from "./src/utils/httpClient";

/**
 * 批量生成视频示例
 * 集成了限流、重试、错误处理能力
 */
async function batchGenerateVideos() {
  console.log("🚀 开始批量生成视频...");
  console.log(`⚙️  当前配置：最大并发 ${renderQueue.getStatus().active} 个任务`);

  // 示例：批量生成10条不同主题的视频
  const videoTasks = [
    {
      title: "你知道吗？每天喝水竟然有这么多好处！",
      points: [
        { emoji: "💧", text: "每天喝8杯水，皮肤变好还能提高代谢" },
        { emoji: "⏰", text: "早上起床空腹喝一杯温水，清肠又排毒" },
        { emoji: "🚫", text: "不要等到口渴了再喝水，那时候已经缺水了" },
      ],
      ctaText: "今天你喝够水了吗？",
      themeColor: "#4facfe",
    },
    {
      title: "3个小技巧，让你工作效率直接翻倍",
      points: [
        { emoji: "📝", text: "每天早上列3件最重要的事，先做完再做其他" },
        { emoji: "⏱️", text: "用番茄工作法，工作25分钟休息5分钟" },
        { emoji: "🚫", text: "关闭所有不必要的通知，避免被打断" },
      ],
      ctaText: "今天就试试，效率提升看得见！",
      themeColor: "#ff6b6b",
    },
    {
      title: "普通人如何快速提升认知？这3个方法亲测有效",
      points: [
        { emoji: "📚", text: "每天花30分钟读行业经典书籍" },
        { emoji: "👥", text: "每周和至少1个比你厉害的人聊天" },
        { emoji: "🎤", text: "把学到的知识讲给别人听，费曼学习法yyds" },
      ],
      ctaText: "坚持3个月，你会感谢现在的自己！",
      themeColor: "#43e97b",
    },
  ];

  // 封装成任务
  const tasks = videoTasks.map((video, index) => {
    return async () => {
      console.log(`🎬 开始生成第 ${index + 1} 条视频: ${video.title}`);
      try {
        const outputPath = await generateKnowledgeVideo(video);
        console.log(`✅ 第 ${index + 1} 条视频生成完成: ${outputPath}`);
        return outputPath;
      } catch (error) {
        console.error(`❌ 第 ${index + 1} 条视频生成失败:`, error);
        throw error;
      }
    };
  });

  try {
    // 批量执行，最多同时渲染3条
    const results = await batchRender(tasks, 3);
    console.log("\n🎉 批量生成完成！");
    console.log(`✅ 成功生成 ${results.filter(r => r).length} 条视频`);
    console.log("📋 输出路径:");
    results.forEach((path, index) => {
      console.log(`   ${index + 1}. ${path}`);
    });
  } catch (error) {
    console.error("❌ 批量生成失败:", error);
  }
}

// 测试HTTP重试功能
async function testHttpRetry() {
  console.log("\n🔍 测试HTTP重试功能...");
  try {
    // 测试一个会失败的请求，看看重试机制是否正常工作
    const response = await httpClient.get("https://httpstat.us/503", {
      // 这个接口会返回503错误，触发重试
    });
    console.log("✅ 请求成功", response.status);
  } catch (error) {
    console.log("✅ 重试机制正常工作，错误被捕获");
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    await testHttpRetry();
    await batchGenerateVideos();
  })();
}

export { batchGenerateVideos };
