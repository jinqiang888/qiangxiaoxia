import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type GenerateKouboOptions = {
  coverImage: string;
  avatar: string;
  authorName: string;
  title: string;
  paragraphs: string[];
  audioUrl: string;
  bgmUrl?: string;
  themeColor?: string;
  duration?: number;
  outputPath?: string;
};

export const generateKouboVideo = async (options: GenerateKouboOptions) => {
  const {
    coverImage,
    avatar,
    authorName,
    title,
    paragraphs,
    audioUrl,
    bgmUrl,
    themeColor = "#ff6b6b",
    duration = 60,
    outputPath = path.join(__dirname, "output", `koubo_${Date.now()}.mp4`),
  } = options;

  console.log("🎬 开始生成口播类短视频...");
  console.log(`📝 标题: ${title}`);
  console.log(`👤 作者: ${authorName}`);
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
  const kouboComp = compositions.find((c) => c.id === "KouboTemplate");
  
  if (!kouboComp) {
    throw new Error("未找到KouboTemplate合成");
  }

  // 渲染视频
  console.log("🎞️  正在渲染视频...");
  await renderMedia({
    composition: kouboComp,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: {
      coverImage,
      avatar,
      authorName,
      title,
      paragraphs,
      audioUrl,
      bgmUrl,
      themeColor,
      duration,
    },
    onProgress: ({ progress }) => {
      console.log(`⏳ 渲染进度: ${(progress * 100).toFixed(1)}%`);
    },
  });

  console.log(`✅ 口播视频生成完成！输出路径: ${outputPath}`);
  return outputPath;
};

// 命令行调用
if (import.meta.url === `file://${process.argv[1]}`) {
  generateKouboVideo({
    coverImage: "https://picsum.photos/1080/1920?random=100",
    avatar: "https://picsum.photos/200/200?random=200",
    authorName: "知识君",
    title: "普通人如何快速提升认知？这3个方法亲测有效",
    paragraphs: [
      "第一个方法：每天花30分钟读行业经典书籍",
      "第二个方法：每周和至少1个比你厉害的人聊天",
      "第三个方法：把学到的知识讲给别人听，费曼学习法yyds",
      "坚持3个月，你会发现自己的思维方式完全不一样"
    ],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    bgmUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    themeColor: "#ff6b6b",
    duration: 60,
  }).catch((err) => {
    console.error("❌ 生成失败:", err);
    process.exit(1);
  });
}
