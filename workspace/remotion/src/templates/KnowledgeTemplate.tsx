import { useCurrentFrame, interpolate, AbsoluteFill, Img, Text, Sequence } from "remotion";
import { FFmpeg } from "@ffmpeg-installer/ffmpeg";

type KnowledgeTemplateProps = {
  /** 视频标题 */
  title: string;
  /** 知识点列表，最多3条 */
  points: {
    emoji: string;
    text: string;
  }[];
  /** 结尾CTA文字 */
  ctaText: string;
  /** 主题色 */
  themeColor: string;
  /** 视频时长（秒），默认30秒 */
  duration?: number;
};

export const KnowledgeTemplate: React.FC<KnowledgeTemplateProps> = ({
  title,
  points,
  ctaText,
  themeColor = "#667eea",
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const totalFrames = duration * fps;

  // 开场动画（0-3秒）
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const titleScale = interpolate(frame, [0, 30], [0.8, 1], { extrapolateRight: "clamp" });

  // 知识点出场动画（3-20秒）
  const getPointOpacity = (index: number) => {
    const startFrame = 30 + index * 40;
    return interpolate(frame, [startFrame, startFrame + 20], [0, 1], { extrapolateRight: "clamp" });
  };

  const getPointY = (index: number) => {
    const startFrame = 30 + index * 40;
    return interpolate(frame, [startFrame, startFrame + 20], [50, 0], { extrapolateRight: "clamp" });
  };

  // 结尾CTA动画（20-30秒）
  const ctaOpacity = interpolate(frame, [600, 630], [0, 1], { extrapolateRight: "clamp" });
  const ctaScale = interpolate(frame, [600, 630], [0.8, 1.1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`,
        fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* 顶部渐变装饰 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          background: "rgba(255, 255, 255, 0.1)",
          borderBottomLeftRadius: 100,
          borderBottomRightRadius: 100,
        }}
      />

      {/* 开场标题 */}
      <Sequence from={0} to={300}>
        <div
          style={{
            position: "absolute",
            top: 150,
            left: 0,
            right: 0,
            padding: "0 60px",
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              lineHeight: 1.2,
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>
      </Sequence>

      {/* 知识点列表 */}
      <div
        style={{
          position: "absolute",
          top: 350,
          left: 0,
          right: 0,
          padding: "0 80px",
        }}
      >
        {points.map((point, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: 60,
              opacity: getPointOpacity(index),
              transform: `translateY(${getPointY(index)}px)`,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
                marginRight: 30,
                flexShrink: 0,
                backdropFilter: "blur(10px)",
              }}
            >
              {point.emoji}
            </div>
            <p
              style={{
                flex: 1,
                fontSize: 42,
                color: "white",
                lineHeight: 1.5,
                margin: 0,
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              {point.text}
            </p>
          </div>
        ))}
      </div>

      {/* 结尾CTA */}
      <Sequence from={600} to={totalFrames}>
        <div
          style={{
            position: "absolute",
            bottom: 200,
            left: 0,
            right: 0,
            padding: "0 60px",
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              padding: "40px 60px",
              borderRadius: 30,
              textAlign: "center",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            }}
          >
            <p
              style={{
                fontSize: 48,
                fontWeight: "bold",
                color: themeColor,
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {ctaText}
            </p>
            <p
              style={{
                fontSize: 32,
                color: "#666",
                margin: "20px 0 0 0",
              }}
            >
              关注我，每天学点有用的知识✨
            </p>
          </div>
        </div>
      </Sequence>

      {/* 底部水印 */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 24,
          color: "rgba(255, 255, 255, 0.7)",
        }}
      >
        @知识科普君
      </div>
    </AbsoluteFill>
  );
};
