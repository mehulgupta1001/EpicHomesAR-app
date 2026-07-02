# Bake Epic Homes house GLB to vertex colors (Blender)

Use this so the **same Epic Homes design and colors** show in the AR app by storing them as vertex colors instead of textures.

## Quick way: run the script (one file at a time)

1. **Install Blender** (free): https://www.blender.org/download/

2. **Import your house GLB in Blender**
   - Start Blender.
   - **File → Import → glTF 2.0 (.glb/.gltf)** (not “Open”, which is for .blend files).
   - Go to your project, e.g.  
     `EpicHomesARPureRN\src\assets\models\houses\`
   - Select one file, e.g. **1 Module - Green (centered).glb**, and click **Import glTF 2.0**.

3. **Run the bake script**
   - At the top, switch to the **Scripting** workspace (tab).
   - **File → Open** (or drag the script into Blender).
   - Open:  
     `EpicHomesARPureRN\scripts\blender_bake_vertex_colors.py`
   - Click **Run Script** (or press Alt+P).

4. **Check the result**
   - The script prints in the **System Console** (Window → Toggle System Console).
   - It exports to the **same folder** as the file you opened, with name like:  
     `1 Module - Green (centered)_baked.glb`

5. **Use the baked file in the app**
   - Copy `*_baked.glb` into:
     - `android/app/src/main/assets/models/houses/`
     - `src/assets/models/houses/`
   - **Rename** the baked file back to the original name (e.g. replace  
     `1 Module - Green (centered).glb` with the new one), **or** update the app to use the `_baked` filename.
   - Rebuild the app and test in AR.

Repeat for each house variant (Blue, Green, Brown; 1/2/4/6 module) you use.

**IDE warning:** Your editor may say `Import "bpy" could not be resolved`. That’s normal: `bpy` only exists when the script runs inside Blender. You can ignore it or add `# pyright: reportMissingImports=false` at the top (already in the script).

**Blender “not responding”:** Baking can take 1–2 minutes on a house model. Blender may look frozen; wait until the **System Console** (Window → Toggle System Console) shows `Bake finished.` and `Exported: ...`. If it never finishes, try a simpler model first or reduce **Render Properties → Cycles → Samples** to 32 before running the script.

---

## Blender 5.0

If the baked GLB **crashes the app** in AR, use **Blender 4.0 LTS** for this bake only, or keep non-baked models.

## Manual way (if the script fails)

1. **File → Open** your `.glb`.
2. **Select all meshes**: Select → Select All by Type → Mesh.
3. **Object Data Properties** (right panel, green triangle icon) → **Vertex Colors** → **+** to add a layer (e.g. name `Col`).
4. **Render Properties** (camera icon) → **Render Engine** = **Cycles**.
5. **Render** menu → **Bake** → **Bake Type**: **Diffuse**, **Target**: **Vertex Colors**, choose your layer → **Bake**.
6. **File → Export → glTF 2.0 (.glb)** → enable **Vertex Colors** / **Attributes** → Export.
7. Copy the exported GLB into the two folders above and rebuild.

---

## If Blender 4.1 doesn’t export vertex colors

There is a known issue in Blender 4.1 with exporting vertex colors when materials are present. If the exported GLB still doesn’t show colors in the app:

- Use **Blender 4.0** for this bake, or  
- Try the manual steps and ensure the color attribute is **Face Corner** + **Byte Color** (Object Data Properties → Vertex Colors / Color Attributes).
