import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import path from "path";

const renderVideo = async () => {
  console.log("🎬 开始打包Remotion项目...");
  
  // 打包项目
  const bundleLocation = await bundle({
    entryPoint: path.join(__dirname, "src/Root.tsx"),
  });

  console.log("📦 项目打包完成，获取可用合成...");
  
  // 获取所有可用合成
  const compositions = await getCompositions(bundleLocation);
  
  const helloWorldComp = compositions.find((c) => c.id === "HelloWorld");
  if (!helloWorldComp) {
    throw new Error("未找到HelloWorld合成");
  }

  console.log("🎞️  开始渲染视频...");
  
  // 渲染视频
  const outputPath = path.join(__dirname, "output", "hello-world.mp4");
  
  await renderMedia({
    composition: helloWorldComp,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    onProgress: ({ progress }) => {
      console.log(`⏳ 渲染进度: ${(progress * 100).toFixed(1)}%`);
    },
  });

  console.log(`✅ 视频渲染完成！输出路径: ${outputPath}`);
};

renderVideo().catch((err) => {
  console.error("❌ 渲染失败:", err);
  process.exit(1);
});
