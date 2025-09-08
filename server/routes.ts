import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService } from "./objectStorage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Debug endpoint to list files in object storage
  app.get("/debug/storage", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const searchPaths = objectStorageService.getPublicObjectSearchPaths();
      console.log(`🔍 Public search paths:`, searchPaths);
      
      // Try to list files in the bucket
      const bucketName = searchPaths[0].split('/')[1]; // Extract bucket name
      const bucket = objectStorageService.objectStorageClient.bucket(bucketName);
      
      const [files] = await bucket.getFiles({ prefix: 'public/' });
      const fileList = files.map(file => ({
        name: file.name,
        size: file.metadata.size,
        contentType: file.metadata.contentType
      }));
      
      res.json({
        searchPaths,
        bucketName,
        files: fileList
      });
    } catch (error) {
      console.error("❌ Error listing storage files:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Audio files from object storage
  app.get("/audio/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    console.log(`🎵 Searching for audio file: ${filePath}`);
    
    const objectStorageService = new ObjectStorageService();
    try {
      console.log(`🔍 Search paths:`, objectStorageService.getPublicObjectSearchPaths());
      
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        console.log(`❌ Audio file not found: ${filePath}`);
        return res.status(404).json({ error: `Audio file not found: ${filePath}` });
      }
      
      console.log(`✅ Found audio file: ${filePath}`);
      // Cache audio files for 24 hours for better performance
      objectStorageService.downloadObject(file, res, 86400);
    } catch (error) {
      console.error("❌ Error serving audio file:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Proxy route for Yandex.Disk audio files
  app.get('/api/proxy-audio', async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL parameter is required' });
      }

      // Get the direct download URL from Yandex.Disk API
      const publicKey = encodeURIComponent(url);
      const apiUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${publicKey}`;
      
      const apiResponse = await fetch(apiUrl);
      if (!apiResponse.ok) {
        throw new Error(`Yandex API error: ${apiResponse.statusText}`);
      }
      
      const data = await apiResponse.json();
      const downloadUrl = data.href;
      
      if (!downloadUrl) {
        throw new Error('No download URL received from Yandex.Disk');
      }

      // Fetch the actual audio file
      const audioResponse = await fetch(downloadUrl);
      if (!audioResponse.ok) {
        throw new Error(`Failed to fetch audio: ${audioResponse.statusText}`);
      }

      // Set appropriate headers for audio streaming
      res.set({
        'Content-Type': audioResponse.headers.get('content-type') || 'audio/mpeg',
        'Content-Length': audioResponse.headers.get('content-length') || '',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600'
      });

      // Stream the audio data
      if (audioResponse.body) {
        const reader = audioResponse.body.getReader();
        
        const pump = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        };
        
        await pump();
      } else {
        res.end();
      }

    } catch (error) {
      console.error('Proxy audio error:', error);
      res.status(500).json({ error: 'Failed to proxy audio file' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
