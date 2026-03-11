import { useCurrentFrame, interpolate, AbsoluteFill, Img, Text, Sequence, Audio } from "remotion";

type KouboTemplateProps = {
  /** 视频封面图 */
  coverImage: string;
  /** 博主头像 */
  avatar: string;
  /** 博主名称 */
  authorName: string;
  /** 视频标题 */
  title: string;
  /** 口播文案，按段落拆分 */
  paragraphs: string[];
  /** 配音音频路径 */
  audioUrl: string;
  /** 背景音乐路径 */
  bgmUrl?: string;
  /** 主题色 */
  themeColor?: string;
  /** 视频时长（秒） */
  duration?: number;
};

export const KouboTemplate: React.FC<KouboTemplateProps> = ({
  coverImage,
  avatar,
  authorName,
  title,
  paragraphs,
  audioUrl,
  bgmUrl,
  themeColor = "#ff6b6b",
  duration = 60,
}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const totalFrames = duration * fps;

  // 封面动画（0-3秒）
  const coverOpacity = interpolate(frame, [0, 30, 60], [1, 1, 0], { extrapolateRight: "clamp" });
  const coverScale = interpolate(frame, [0, 60], [1, 1.1], { extrapolateRight: "clamp" });

  // 头像入场动画（3秒后）
  const avatarScale = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" });
  const avatarOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" });

  // 段落显示动画
  const getParagraphOpacity = (index: number) => {
    const startFrame = 90 + index * 120; // 每个段落显示4秒
    return interpolate(frame, [startFrame, startFrame + 30], [0, 1], { extrapolateRight: "clamp" });
  };

  const getParagraphY = (index: number) => {
    const startFrame = 90 + index * 120;
    return interpolate(frame, [startFrame, startFrame + 30], [30, 0], { extrapolateRight: "clamp" });
  };

  // 进度条
  const progress = interpolate(frame, [0, totalFrames], [0, 1080], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "#f8f9fa",
        fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* 音频 */}
      <Audio src={audioUrl} startFrom={0} />
      {bgmUrl && <Audio src={bgmUrl} startFrom={0} volume={0.1} />}

      {/* 封面 */}
      <Sequence from={0} to={60}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: coverOpacity,
            transform: `scale(${coverScale})`,
          }}
        >
          <Img
            src={coverImage}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* 封面遮罩 */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))",
            }}
          />
          {/* 封面标题 */}
          <div
            style={{
              position: "absolute",
              bottom: 150,
              left: 0,
              right: 0,
              padding: "0 60px",
            }}
          >
            <h1
              style={{
                fontSize: 72,
                fontWeight: "bold",
                color: "white",
                lineHeight: 1.3,
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                margin: 0,
              }}
            >
              {title}
            </h1>
          </div>
        </div>
      </Sequence>

      {/* 博主信息栏 */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          right: 60,
          display: "flex",
          alignItems: "center",
          opacity: avatarOpacity,
          transform: `scale(${avatarScale})`,
        }}
      >
        {/* 头像 */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: `4px solid ${themeColor}`,
            overflow: "hidden",
            marginRight: 24,
            flexShrink: 0,
          }}
        >
          <Img
            src={avatar}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        {/* 名称 */}
        <div>
          <p
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: "#333",
              margin: 0,
            }}
          >
            {authorName}
          </p>
          <p
            style={{
              fontSize: 24,
              color: "#666",
              margin: "8px 0 0 0",
            }}
          >
            每天分享实用知识
          </p>
        </div>
      </div>

      {/* 口播文案 */}
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 0,
          right: 0,
          padding: "0 80px",
        }}
      >
        {paragraphs.map((paragraph, index) => (
          <div
            key={index}
            style={{
              marginBottom: 40,
              opacity: getParagraphOpacity(index),
              transform: `translateY(${getParagraphY(index)}px)`,
            }}
          >
            <p
              style={{
                fontSize: 48,
                lineHeight: 1.6,
                color: "#333",
                margin: 0,
                padding: "20px 30px",
                background: "white",
                borderRadius: 20,
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
                borderLeft: `8px solid ${themeColor}`,
              }}
            >
              {paragraph}
            </p>
          </div>
        ))}
      </div>

      {/* 进度条 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 8,
          width: progress,
          backgroundColor: themeColor,
        }}
      />

      {/* 底部关注引导 */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 28,
            color: "#999",
            margin: 0,
          }}
        >
          关注我，学习更多实用技巧 ✨
        </p>
      </div>
    </AbsoluteFill>
  );
};
