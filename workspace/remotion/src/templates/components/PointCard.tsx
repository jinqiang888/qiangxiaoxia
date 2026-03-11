import { useCurrentFrame, interpolate } from "remotion";

type PointCardProps = {
  emoji: string;
  text: string;
  index: number; // 第几个知识点，用于延迟动画
  startFrame: number; // 开始动画的帧
  themeColor: string;
};

export const PointCard: React.FC<PointCardProps> = ({ emoji, text, index, startFrame, themeColor }) => {
  const frame = useCurrentFrame();
  const delay = index * 30; // 每个知识点延迟30帧入场

  const opacity = interpolate(frame, [startFrame + delay, startFrame + delay + 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const y = interpolate(frame, [startFrame + delay, startFrame + delay + 20], [30, 0], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [startFrame + delay, startFrame + delay + 20], [0.95, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        marginBottom: 60,
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
      }}
    >
      {/* Emoji图标 */}
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
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        {emoji}
      </div>

      {/* 文字内容 */}
      <div
        style={{
          flex: 1,
          background: "rgba(255, 255, 255, 0.95)",
          padding: "24px 32px",
          borderRadius: 24,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          borderLeft: `8px solid ${themeColor}`,
        }}
      >
        <p
          style={{
            fontSize: 42,
            color: "#333",
            lineHeight: 1.5,
            margin: 0,
            fontWeight: 500,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};
