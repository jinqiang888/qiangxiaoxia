import { useCurrentFrame, interpolate } from "remotion";

type OutroProps = {
  ctaText: string;
  themeColor: string;
  startFrame: number; // 开始动画的帧
};

export const Outro: React.FC<OutroProps> = ({ ctaText, themeColor, startFrame }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [startFrame, startFrame + 30], [0.8, 1.05], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 200,
        left: 0,
        right: 0,
        padding: "0 60px",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* CTA卡片 */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.98)",
          padding: "48px 64px",
          borderRadius: 32,
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          backdropFilter: "blur(20px)",
        }}
      >
        <p
          style={{
            fontSize: 56,
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
            margin: "24px 0 0 0",
            fontWeight: "normal",
          }}
        >
          关注我，每天学点有用的知识✨
        </p>
      </div>

      {/* 底部水印 */}
      <div
        style={{
          position: "absolute",
          bottom: -120,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 24,
          color: "rgba(255, 255, 255, 0.8)",
          textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        @知识科普君
      </div>
    </div>
  );
};
