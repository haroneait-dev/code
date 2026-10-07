import { Composition } from "remotion";
import { ClaudeCodeDemo } from "./ClaudeCodeDemo";
import { TikTokAstuces } from "./TikTokAstuces";

export function RemotionRoot() {
  return (
    <>
      <Composition id="ClaudeCodeDemo" component={ClaudeCodeDemo} durationInFrames={330} fps={30} width={880} height={550} />
      <Composition id="TikTokAstuces" component={TikTokAstuces} durationInFrames={540} fps={30} width={1080} height={1920} />
    </>
  );
}
