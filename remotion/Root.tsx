import { Composition } from "remotion";
import { ClaudeCodeDemo } from "./ClaudeCodeDemo";
import { TikTokAstuces } from "./TikTokAstuces";
import { TikTokVideo, TIKTOK_FRAMES } from "./TikTokVideo";
import { VIDEOS } from "./videos";

export function RemotionRoot() {
  return (
    <>
      <Composition id="ClaudeCodeDemo" component={ClaudeCodeDemo} durationInFrames={330} fps={30} width={880} height={550} />
      {VIDEOS.map((v) => (
        <Composition key={v.id} id={`TikTok-${v.id}`} component={TikTokVideo} defaultProps={{ video: v }} durationInFrames={TIKTOK_FRAMES} fps={30} width={1080} height={1920} />
      ))}
      <Composition id="TikTokAstuces" component={TikTokAstuces} durationInFrames={540} fps={30} width={1080} height={1920} />
    </>
  );
}
