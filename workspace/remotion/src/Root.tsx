import { Composition, registerRoot } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { KnowledgeTemplate } from "./templates/KnowledgeTemplate";
import { KouboTemplate } from "./templates/KouboTemplate";

const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          titleText: "欢迎使用Remotion视频工厂",
          subtitleText: "自动生成短视频，效率提升10倍",
          logoColor: "#0b84f3",
        }}
      />

      {/* 知识科普类短视频模板 */}
      <Composition
        id="KnowledgeTemplate"
        component={KnowledgeTemplate}
        durationInFrames={900} // 30秒
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: "你知道吗？每天喝水竟然有这么多好处！",
          points: [
            {
              emoji: "💧",
              text: "每天喝8杯水，皮肤变好还能提高代谢",
            },
            {
              emoji: "⏰",
              text: "早上起床空腹喝一杯温水，清肠又排毒",
            },
            {
              emoji: "🚫",
              text: "不要等到口渴了再喝水，那时候已经缺水了",
            },
          ],
          ctaText: "今天你喝够水了吗？",
          themeColor: "#667eea",
          duration: 30,
        }}
      />

      {/* 真人出镜口播类短视频模板 */}
      <Composition
        id="KouboTemplate"
        component={KouboTemplate}
        durationInFrames={1800} // 60秒
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          coverImage: "https://picsum.photos/1080/1920?random=1",
          avatar: "https://picsum.photos/200/200?random=2",
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
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);

