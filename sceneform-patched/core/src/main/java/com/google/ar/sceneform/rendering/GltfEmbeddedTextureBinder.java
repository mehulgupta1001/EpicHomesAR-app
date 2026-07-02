package com.google.ar.sceneform.rendering;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.google.android.filament.Engine;
import com.google.android.filament.MaterialInstance;
import com.google.android.filament.RenderableManager;
import com.google.android.filament.TextureSampler;
import com.google.android.filament.android.TextureHelper;
import com.google.android.filament.gltfio.FilamentAsset;

import org.json.JSONArray;
import org.json.JSONObject;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Binds embedded GLB PNG textures and baseColorFactor values to Filament glTF material instances.
 *
 * <p>Sceneform's {@code ResourceLoader.loadResources()} often fails for Epic Homes GLBs (embedded
 * bufferView PNGs, empty {@code getResourceUris()}). Texture GPU upload must run on the render
 * thread with an active GL context — call {@link #applyMaterialTextures} from {@code
 * prepareForDraw}.
 */
final class GltfEmbeddedTextureBinder {
  private static final String TAG = GltfEmbeddedTextureBinder.class.getSimpleName();

  private GltfEmbeddedTextureBinder() {}

  /** Applies solid baseColorFactor values (safe without GL context). */
  static int applyMaterialFactors(
      byte[] glbBytes, FilamentAsset asset, RenderableManager renderableManager) {
    if (glbBytes == null || glbBytes.length == 0 || asset == null) {
      return 0;
    }

    ParsedGlb parsed;
    try {
      parsed = parseGlb(glbBytes);
    } catch (Exception e) {
      Log.e(TAG, "Failed to parse GLB for factors: " + e.getMessage());
      return 0;
    }

    Map<String, JSONObject> materialsByName = buildMaterialNameMap(parsed.json);
    if (materialsByName.isEmpty()) {
      return 0;
    }

    int bound = 0;
    Set<MaterialInstance> seen = new HashSet<>();
    for (MaterialInstance instance : collectMaterialInstances(asset, renderableManager)) {
      if (!seen.add(instance)) {
        continue;
      }
      JSONObject mat = materialsByName.get(instance.getName());
      if (mat != null && applyBaseColorFactor(instance, mat)) {
        bound++;
      }
    }

    Log.i(TAG, "Applied baseColorFactor on " + bound + " material instance(s)");
    return bound;
  }

  /** Uploads embedded PNGs and binds baseColorMap (requires active GL context). */
  static int applyMaterialTextures(
      byte[] glbBytes,
      FilamentAsset asset,
      Engine engine,
      RenderableManager renderableManager,
      java.util.List<com.google.android.filament.Texture> textureOwner) {
    if (glbBytes == null || glbBytes.length == 0 || asset == null || engine == null) {
      return 0;
    }

    ParsedGlb parsed;
    try {
      parsed = parseGlb(glbBytes);
    } catch (Exception e) {
      Log.e(TAG, "Failed to parse GLB for textures: " + e.getMessage());
      return 0;
    }

    JSONArray textures = parsed.json.optJSONArray("textures");
    JSONArray images = parsed.json.optJSONArray("images");
    JSONArray bufferViews = parsed.json.optJSONArray("bufferViews");
    if (textures == null || images == null || bufferViews == null) {
      Log.w(TAG, "GLB missing textures/images/bufferViews");
      return 0;
    }

    Map<String, JSONObject> materialsByName = buildMaterialNameMap(parsed.json);
    if (materialsByName.isEmpty()) {
      return 0;
    }

    TextureSampler sampler = new TextureSampler();
    Map<Integer, com.google.android.filament.Texture> textureCache = new HashMap<>();
    int bound = 0;
    Set<MaterialInstance> seen = new HashSet<>();

    for (MaterialInstance instance : collectMaterialInstances(asset, renderableManager)) {
      if (!seen.add(instance)) {
        continue;
      }
      JSONObject mat = materialsByName.get(instance.getName());
      if (mat == null) {
        continue;
      }
      try {
        if (!mat.has("pbrMetallicRoughness")) {
          continue;
        }
        JSONObject pbr = mat.getJSONObject("pbrMetallicRoughness");
        if (!pbr.has("baseColorTexture")) {
          continue;
        }
        int textureIndex = pbr.getJSONObject("baseColorTexture").getInt("index");
        com.google.android.filament.Texture filamentTexture =
            textureCache.computeIfAbsent(
                textureIndex,
                idx ->
                    decodeGltfTexture(
                        glbBytes,
                        parsed.binChunkOffset,
                        textures,
                        images,
                        bufferViews,
                        idx,
                        engine,
                        textureOwner));
        if (filamentTexture != null) {
          instance.setParameter("baseColorIndex", 0);
          instance.setParameter("baseColorMap", filamentTexture, sampler);
          bound++;
          Log.d(TAG, "Texture bound to material: " + instance.getName());
        }
      } catch (Exception e) {
        Log.w(TAG, "Texture bind failed for " + instance.getName() + ": " + e.getMessage());
      }
    }

    Log.i(TAG, "Bound baseColorMap on " + bound + " material instance(s)");
    return bound;
  }

  static byte[] bytesFromBuffer(java.nio.Buffer buffer) {
    if (!(buffer instanceof ByteBuffer)) {
      return null;
    }
    ByteBuffer bb = ((ByteBuffer) buffer).duplicate();
    bb.rewind();
    byte[] bytes = new byte[bb.remaining()];
    bb.get(bytes);
    return bytes;
  }

  private static Set<MaterialInstance> collectMaterialInstances(
      FilamentAsset asset, RenderableManager renderableManager) {
    Set<MaterialInstance> instances = new HashSet<>();
    MaterialInstance[] assetMaterials = asset.getMaterialInstances();
    if (assetMaterials != null) {
      for (MaterialInstance mi : assetMaterials) {
        if (mi != null) {
          instances.add(mi);
        }
      }
    }
    if (renderableManager != null) {
      for (int entity : asset.getEntities()) {
        int renderableInstance = renderableManager.getInstance(entity);
        if (renderableInstance == 0) {
          continue;
        }
        int primitiveCount = renderableManager.getPrimitiveCount(renderableInstance);
        for (int p = 0; p < primitiveCount; p++) {
          MaterialInstance mi = renderableManager.getMaterialInstanceAt(renderableInstance, p);
          if (mi != null) {
            instances.add(mi);
          }
        }
      }
    }
    return instances;
  }

  private static Map<String, JSONObject> buildMaterialNameMap(JSONObject root) {
    Map<String, JSONObject> map = new HashMap<>();
    if (!root.has("materials")) {
      return map;
    }
    try {
      JSONArray materials = root.getJSONArray("materials");
      for (int i = 0; i < materials.length(); i++) {
        JSONObject mat = materials.getJSONObject(i);
        String name = mat.optString("name", "material_" + i);
        map.put(name, mat);
      }
    } catch (org.json.JSONException e) {
      Log.e(TAG, "Failed to read materials: " + e.getMessage());
    }
    return map;
  }

  private static boolean applyBaseColorFactor(MaterialInstance instance, JSONObject mat) {
    try {
      if (!mat.has("pbrMetallicRoughness")) {
        return false;
      }
      JSONObject pbr = mat.getJSONObject("pbrMetallicRoughness");
      if (!pbr.has("baseColorFactor")) {
        return false;
      }
      JSONArray factor = pbr.getJSONArray("baseColorFactor");
      if (factor.length() < 4) {
        return false;
      }
      instance.setParameter(
          "baseColorFactor",
          (float) factor.getDouble(0),
          (float) factor.getDouble(1),
          (float) factor.getDouble(2),
          (float) factor.getDouble(3));
      return true;
    } catch (Exception e) {
      Log.w(TAG, "baseColorFactor failed for " + instance.getName() + ": " + e.getMessage());
      return false;
    }
  }

  private static com.google.android.filament.Texture decodeGltfTexture(
      byte[] glbBytes,
      int binChunkOffset,
      JSONArray textures,
      JSONArray images,
      JSONArray bufferViews,
      int textureIndex,
      Engine engine,
      java.util.List<com.google.android.filament.Texture> textureOwner) {
    try {
      JSONObject texture = textures.getJSONObject(textureIndex);
      int imageIndex = texture.getInt("source");
      JSONObject image = images.getJSONObject(imageIndex);

      byte[] imageBytes;
      if (image.has("bufferView")) {
        int bufferViewIndex = image.getInt("bufferView");
        JSONObject bufferView = bufferViews.getJSONObject(bufferViewIndex);
        int byteOffset = bufferView.optInt("byteOffset", 0);
        int byteLength = bufferView.getInt("byteLength");
        int start = binChunkOffset + byteOffset;
        if (start + byteLength > glbBytes.length) {
          return null;
        }
        imageBytes = new byte[byteLength];
        System.arraycopy(glbBytes, start, imageBytes, 0, byteLength);
      } else {
        return null;
      }

      BitmapFactory.Options options = new BitmapFactory.Options();
      options.inScaled = false;
      options.inPremultiplied = true;
      Bitmap bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length, options);
      if (bitmap == null) {
        Log.w(TAG, "PNG decode failed for texture " + textureIndex);
        return null;
      }
      if (bitmap.getConfig() != Bitmap.Config.ARGB_8888) {
        Bitmap converted = bitmap.copy(Bitmap.Config.ARGB_8888, false);
        bitmap.recycle();
        bitmap = converted;
      }

      com.google.android.filament.Texture filamentTexture =
          new com.google.android.filament.Texture.Builder()
              .width(bitmap.getWidth())
              .height(bitmap.getHeight())
              .depth(1)
              .levels(0xff)
              .sampler(com.google.android.filament.Texture.Sampler.SAMPLER_2D)
              .format(com.google.android.filament.Texture.InternalFormat.SRGB8_A8)
              .build(engine);

      TextureHelper.setBitmap(engine, filamentTexture, 0, bitmap);
      filamentTexture.generateMipmaps(engine);
      bitmap.recycle();

      textureOwner.add(filamentTexture);
      return filamentTexture;
    } catch (Exception e) {
      Log.w(TAG, "decodeGltfTexture[" + textureIndex + "]: " + e.getMessage());
      return null;
    }
  }

  private static final class ParsedGlb {
    final JSONObject json;
    final int binChunkOffset;

    ParsedGlb(JSONObject json, int binChunkOffset) {
      this.json = json;
      this.binChunkOffset = binChunkOffset;
    }
  }

  private static ParsedGlb parseGlb(byte[] glbBytes) throws Exception {
    if (glbBytes.length < 12) {
      throw new IllegalArgumentException("GLB too small");
    }
    int magic = ByteBuffer.wrap(glbBytes, 0, 4).order(ByteOrder.LITTLE_ENDIAN).getInt();
    if (magic != 0x46546C67) {
      throw new IllegalArgumentException("Not a GLB file");
    }

    int offset = 12;
    JSONObject json = null;
    int binChunkOffset = 0;

    while (offset + 8 <= glbBytes.length) {
      int chunkLength =
          ByteBuffer.wrap(glbBytes, offset, 4).order(ByteOrder.LITTLE_ENDIAN).getInt();
      int chunkType =
          ByteBuffer.wrap(glbBytes, offset + 4, 4).order(ByteOrder.LITTLE_ENDIAN).getInt();
      offset += 8;
      if (offset + chunkLength > glbBytes.length) {
        break;
      }
      if (chunkType == 0x4E4F534A) {
        json =
            new JSONObject(new String(glbBytes, offset, chunkLength, StandardCharsets.UTF_8));
      } else if (chunkType == 0x004E4942) {
        binChunkOffset = offset;
      }
      offset += chunkLength;
    }

    if (json == null) {
      throw new IllegalArgumentException("GLB missing JSON chunk");
    }
    if (binChunkOffset == 0) {
      throw new IllegalArgumentException("GLB missing BIN chunk");
    }

    return new ParsedGlb(json, binChunkOffset);
  }
}
