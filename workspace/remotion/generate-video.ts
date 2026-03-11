import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type GenerateVideoOptions = {
  title: string;
  points: { emoji: string; text: string }[];
  ctaText: string;
  themeColor?: string;
  duration?: number;
  outputPath?: string;
};

const generateKnowledgeVideo = async (options: GenerateVideoOptions) => {
  const {
    title,
    points,
    ctaText,
    themeColor = "#667eea",
    duration = 30,
    outputPath = path.join(__dirname, "output", `knowledge_${Date.now()}.mp4`),
  } = options;

  console.log("🎬 开始生成知识科普视频...");
  console.log(`📝 标题: ${title}`);
  console.log(`🎨 主题色: ${themeColor}`);
  console.log(`⏱️  时长: ${duration}秒`);

  // 确保输出目录存在
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 打包项目
  console.log("📦 正在打包项目...");
  const bundleLocation = await bundle({
    entryPoint: path.join(__dirname, "src/Root.tsx"),
  });

  // 获取合成
  console.log("🔍 正在获取合成...");
  const compositions = await getCompositions(bundleLocation);
  const knowledgeComp = compositions.find((c) => c.id === "KnowledgeTemplate");
  
  if (!knowledgeComp) {
    throw new Error("未找到KnowledgeTemplate合成");
  }

  // 渲染视频
  console.log("🎞️  正在渲染视频...");
  await renderMedia({
    composition: knowledgeComp,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: {
      title,
      points,
      ctaText,
      themeColor,
      duration,
    },
    onProgress: ({ progress }) => {
      console.log(`⏳ 渲染进度: ${(progress * 100).toFixed(1)}%`);
    },
  });

  console.log(`✅ 视频生成完成！输出路径: ${outputPath}`);
  return outputPath;
};

export { generateKnowledgeVideo };

// 命令行调用示例
if (import.meta.url === `file://${process.argv[1]}`) {
  // 示例：生成喝水科普视频
  generateKnowledgeVideo({
    title: "你知道吗？每天喝水竟然有这么多好处！",
    points: [
      { emoji: "💧", text: "每天喝8杯水，皮肤变好还能提高代谢" },
      { emoji: "⏰", text: "早上起床空腹喝一杯温水，清肠又排毒" },
      { emoji: "🚫", text: "不要等到口渴了再喝水，那时候已经缺水了" },
    ],
    ctaText: "今天你喝够水了吗？",
    themeColor: "#4facfe",
  }).catch((err) => {
    console.error("❌ 生成失败:", err);
    process.exit(1);
  });
}
