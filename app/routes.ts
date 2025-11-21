import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("modules/catalog/pages/CatalogHome.tsx"),
  route("lesson/:id", "modules/catalog/pages/LessonDetail.tsx"),

   route("tools/metronome", "modules/tools/pages/MetronomePage.tsx"),
] satisfies RouteConfig;
