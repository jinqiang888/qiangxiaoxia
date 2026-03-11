import { Sequence, AbsoluteFill } from "remotion";
import { Intro } from "./components/Intro";
import { PointCard } from "./components/PointCard";
import { Outro } from "./components/Outro";

type KnowledgeTemplateV2Props = {
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

export const KnowledgeTemplateV2: React.FC<KnowledgeTemplateV2Props> = ({
  title,
  points,
  ctaText,
  themeColor = "#667eea",
  duration = 30,
}) => {
  const fps = 30;
  const totalFrames = duration * fps;

  // 时间轴配置
  const introDuration = 60; // 前2秒入场
  const pointsStartFrame = introDuration;
  const pointsDuration = 120; // 4秒展示知识点
  const outroStartFrame = pointsStartFrame + pointsDuration; // 最后4秒结尾

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`,
        fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* 入场动画 */}
      <Sequence from={0} to={introDuration}>
        <Intro title={title} themeColor={themeColor} duration={introDuration} />
      </Sequence>

      {/* 知识点列表 */}
      <Sequence from={pointsStartFrame} to={outroStartFrame}>
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
            <PointCard
              key={index}
              emoji={point.emoji}
              text={point.text}
              index={index}
              startFrame={0}
              themeColor={themeColor}
            />
          ))}
        </div>
      </Sequence>

      {/* 结尾CTA */}
      <Sequence from={outroStartFrame} to={totalFrames}>
        <Outro ctaText={ctaText} themeColor={themeColor} startFrame={0} />
      </Sequence>
    </AbsoluteFill>
  );
};
