import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
   privateKey: config.IMAGE_KIT_PRIVATE_KEY,
});

export async function uploadFile({ buffer, fileName, folder = "WEARTH" }) {
   const result = await client.files.upload({
      file: await ImageKit.toFile(buffer),
      fileName,
      folder,
   });

   return result;
}
