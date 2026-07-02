package com.google.ar.sceneform.rendering;

import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

/** Prepares GLB/GLTF byte buffers for Filament native gltfio (embedded textures). */
final class GltfBufferUtils {
  private GltfBufferUtils() {}

  /**
   * Returns a direct, little-endian ByteBuffer with position 0 and full GLB data readable by JNI.
   * Stores the prepared buffer back into {@code renderableData} when a new allocation was needed.
   */
  static ByteBuffer prepareForNativeLoad(
      RenderableInternalFilamentAssetData renderableData, Buffer source) {
    if (!(source instanceof ByteBuffer)) {
      throw new IllegalStateException("GLTF source buffer must be a ByteBuffer");
    }
    ByteBuffer input = (ByteBuffer) source;
    ByteBuffer view = input.duplicate();
    view.clear();

    ByteBuffer prepared;
    if (view.isDirect()) {
      prepared = view;
    } else {
      prepared = ByteBuffer.allocateDirect(view.remaining());
      prepared.put(view);
      prepared.flip();
      renderableData.gltfByteBuffer = prepared;
    }
    prepared.order(ByteOrder.LITTLE_ENDIAN);
    prepared.rewind();
    return prepared;
  }
}
