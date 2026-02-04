import { spawn } from "bun";

export async function getVideoDuration(filePath: string): Promise<number> {
  const process = spawn([
    "ffprobe", 
    "-v", "error", 
    "-show_entries", "format=duration", 
    "-of", "default=noprint_wrappers=1:nokey=1", 
    filePath
  ]);

  const text = await new Response(process.stdout).text();
  return parseFloat(text.trim());
}

// Usage in your Express/Bun route