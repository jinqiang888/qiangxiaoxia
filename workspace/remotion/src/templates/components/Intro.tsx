import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

type IntroProps = {
  title: string;
  themeColor: string;
  duration: number; // 入场动画持续帧数
};

export const Intro: React.FC<IntroProps> = ({ title, themeColor, duration = 60 }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, duration], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, duration], [0.8, 1], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, duration], [50, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* 渐变背景 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`,
        }}
      />

      {/* 顶部装饰 */}
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

      {/* 标题 */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          padding: "0 60px",
          opacity,
          transform: `scale(${scale}) translateY(${y}px)`,
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
    </AbsoluteFill>
  );
};
