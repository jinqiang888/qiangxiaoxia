import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

type HelloWorldProps = {
  titleText: string;
  subtitleText: string;
  logoColor: string;
};

export const HelloWorld: React.FC<HelloWorldProps> = ({
  titleText,
  subtitleText,
  logoColor,
}) => {
  const frame = useCurrentFrame();

  // 标题淡入动画
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 副标题延迟淡入
  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo缩放动画
  const scale = interpolate(frame, [0, 45], [0.5, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          backgroundColor: logoColor,
          transform: `scale(${scale})`,
          marginBottom: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 80,
          color: "white",
          fontWeight: "bold",
        }}
      >
        🎥
      </div>

      {/* 标题 */}
      <h1
        style={{
          fontSize: 64,
          color: "white",
          opacity: titleOpacity,
          marginBottom: 20,
          textAlign: "center",
          padding: "0 40px",
        }}
      >
        {titleText}
      </h1>

      {/* 副标题 */}
      <p
        style={{
          fontSize: 36,
          color: "rgba(255, 255, 255, 0.9)",
          opacity: subtitleOpacity,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        {subtitleText}
      </p>

      {/* 底部文字 */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 24,
          color: "rgba(255, 255, 255, 0.7)",
        }}
      >
        Powered by Remotion + OpenClaw
      </div>
    </AbsoluteFill>
  );
};
