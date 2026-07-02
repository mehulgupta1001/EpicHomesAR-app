Patched Sceneform (GLB materials/textures fix)
==============================================

This folder is a minimal build of SceneView/sceneform-android v1.21.0 (core + ux + sceneform only, no samples).

Patch applied:
- In core/.../LoadRenderableFromFilamentGltfTask.java: use Filament.INSTANCE.getResourceLoader() instead of new ResourceLoader(engine). That makes the GLB loader use the same ResourceLoader as Filament.kt (4-arg constructor), so embedded textures load and Epic Homes models show correct colors.

The main app uses this via android/settings.gradle:
  includeBuild('../sceneform-patched') { dependencySubstitution { ... } }

Build fixes for AGP 8.6: namespace in each module, buildFeatures.buildConfig true in core, AGP 8.6.0 in build.gradle.

To refresh from upstream: re-clone sceneform-android v1.21.0, re-apply the one-line patch to LoadRenderableFromFilamentGltfTask.java, copy only core/ ux/ sceneform/ and root build files + this settings.gradle (include only :core :ux :sceneform), then re-apply the AGP/namespace/buildConfig fixes.
