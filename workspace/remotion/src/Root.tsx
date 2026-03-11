import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";

export const RemotionRoot: React.FC = () => {
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
    </>
  );
};
