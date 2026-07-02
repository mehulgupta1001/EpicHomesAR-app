# Blender script: Bake Epic Homes GLB materials into vertex colors, then export GLB.
# Supports Blender 3.x, 4.x, and 5.0.
# Run from Blender: Scripting workspace -> Open this file -> Run Script.
# Before running: File -> Import -> glTF 2.0 and load your house GLB.
#
# IDE: "bpy" exists only in Blender; ignore "could not be resolved" in editor.
# pyright: reportMissingImports=false

import os
import bpy  # type: ignore[import-untyped]  # only available inside Blender

def bl_version():
    """e.g. (5, 0, 0)"""
    return tuple(bpy.app.version)

def ensure_color_attribute(mesh):
    """Ensure mesh has a vertex color attribute (Face Corner, Byte Color) for glTF."""
    if not mesh.color_attributes:
        mesh.color_attributes.new(name="Col", type="BYTE_COLOR", domain="CORNER")
    else:
        # Use first one; ensure it's Byte Color on Corner for glTF
        attr = mesh.color_attributes[0]
        if attr.domain != "CORNER" or attr.data_type != "BYTE_COLOR":
            mesh.color_attributes.new(name="Col", type="BYTE_COLOR", domain="CORNER")
    return mesh.color_attributes[0].name

def get_export_path():
    """Choose export folder and filename. Export folder is created if missing."""
    mesh_objs = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    name = "model"
    if mesh_objs:
        name = mesh_objs[0].name
        if "." in name:
            name = name.rsplit(".", 1)[0]

    if bpy.data.filepath and bpy.data.filepath.lower().endswith((".glb", ".gltf")):
        folder = os.path.dirname(bpy.data.filepath)
        base_name = os.path.splitext(os.path.basename(bpy.data.filepath))[0]
        name = base_name
    else:
        try:
            script_path = bpy.context.space_data.text.filepath
            base = os.path.normpath(os.path.join(os.path.dirname(script_path), ".."))
            folder = os.path.join(base, "src", "assets", "models", "houses")
        except Exception:
            folder = os.path.expanduser("~")
    os.makedirs(folder, exist_ok=True)
    return os.path.join(folder, name + "_baked.glb")


def main():
    print("Blender", ".".join(map(str, bl_version())))
    bpy.context.scene.render.engine = "CYCLES"
    bpy.context.scene.cycles.samples = 128

    bpy.ops.object.select_all(action="DESELECT")
    mesh_objects = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    if not mesh_objects:
        print("No mesh objects. Use File -> Import -> glTF 2.0 to load your house GLB first.")
        return

    export_path = get_export_path()
    print("Will export to:", export_path)
    print("(If that path is wrong, copy the file from there after the script finishes.)")

    for obj in mesh_objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = mesh_objects[0]

    for obj in mesh_objects:
        ensure_color_attribute(obj.data)

    bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="DESELECT")
    for obj in mesh_objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = mesh_objects[0]
    mesh_objects[0].data.color_attributes.active_index = 0

    print("Baking (1-2 minutes for a house model; Blender may look frozen - wait for 'Bake finished.' in System Console)...")
    try:
        # target VERTEX_COLORS bakes to the active color attribute (Blender 3.x–5.x)
        bpy.ops.object.bake(
            type="DIFFUSE",
            target="VERTEX_COLORS",
            use_clear=True,
            margin=16,
            use_selected_to_active=False,
        )
        print("Bake finished.")
    except TypeError as e:
        # Blender 5+ might use a different target enum name
        if "VERTEX_COLORS" in str(e) or "target" in str(e).lower():
            print("Bake failed (try Blender 4.0 LTS if on 5.0):", e)
        else:
            print("Bake failed:", e)
        return
    except Exception as e:
        print("Bake failed:", e)
        return

    bpy.ops.object.select_all(action="SELECT")
    try:
        bpy.ops.export_scene.gltf(
            filepath=export_path,
            export_format="GLB",
            use_selection=True,
            export_attributes=True,
        )
        print("Exported:", export_path)
    except Exception as e:
        print("Export failed:", e)
        return

    print("Done. Copy the _baked.glb into android/app/src/main/assets/models/houses/ then rebuild the app.")

if __name__ == "__main__":
    main()
