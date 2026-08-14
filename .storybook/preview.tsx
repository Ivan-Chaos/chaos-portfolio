import { DecoratorHelpers } from "@storybook/addon-themes";
import type { Decorator, Preview } from "@storybook/nextjs-vite";
import * as React from "react";
import "../app/globals.css";

const { initializeThemeState, pluckThemeFromContext } = DecoratorHelpers;

/**
 * Theme name -> the class applied to the themed ancestor. Light is the absence
 * of a class, matching `@custom-variant dark (&:is(.dark *))` in globals.css and
 * next-themes' `attribute="class"`.
 */
const THEMES = { light: "", dark: "dark" } as const;
type ThemeName = keyof typeof THEMES;

/** Industrial is dark-native, so that is what a story opens in. */
const DEFAULT_THEME: ThemeName = "dark";

const THEME_CLASSES = Object.values(THEMES).filter(Boolean);

initializeThemeState(Object.keys(THEMES), DEFAULT_THEME);

function setHtmlTheme(theme: ThemeName | null) {
  const { classList } = document.documentElement;
  classList.remove(...THEME_CLASSES);
  if (theme && THEMES[theme]) classList.add(THEMES[theme]);
}

/**
 * A themed panel. The background and text colours must sit on a *child* of the
 * element carrying `.dark`, because the dark variant is `&:is(.dark *)` — the
 * element holding the class is not itself matched by it.
 */
function ThemePanel({
  theme,
  label,
  children,
}: {
  theme: ThemeName;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={THEMES[theme]}>
      <div className="min-h-full bg-background p-6 text-foreground">
        {label ? (
          <p className="mb-5 label-caps text-muted-foreground">{label}</p>
        ) : null}
        {children}
      </div>
    </div>
  );
}

function ThemeShell({
  story,
  theme,
  sideBySide,
}: {
  story: React.ReactNode;
  theme: ThemeName;
  sideBySide: boolean;
}) {
  React.useLayoutEffect(() => {
    // In side-by-side mode the themed ancestor moves onto each panel, so <html>
    // has to be cleared — otherwise the "light" panel is still a descendant of
    // `.dark` and renders dark.
    setHtmlTheme(sideBySide ? null : theme);
  }, [theme, sideBySide]);

  if (!sideBySide) {
    return <ThemePanel theme={theme}>{story}</ThemePanel>;
  }

  return (
    // No forced viewport height: these panels also render inside autodocs
    // pages, where a screen-tall block per story would bury the prose.
    <div className="grid gap-px bg-neutral-500/40 md:grid-cols-2">
      {(Object.keys(THEMES) as ThemeName[]).map((name) => (
        <ThemePanel key={name} theme={name} label={name}>
          {story}
        </ThemePanel>
      ))}
    </div>
  );
}

/**
 * Handles both the toolbar theme switch and side-by-side rendering.
 *
 * Storybook has no built-in for showing one story in two themes at once —
 * `withThemeByClassName` mutates a single element and structurally cannot — so
 * this replaces it rather than wrapping it.
 *
 * Known limitation: side-by-side only themes what renders *inside* the panels.
 * Portalled content (Dialog, Popover, Tooltip, Toast) mounts to `document.body`,
 * outside both, so overlay stories should use the toolbar switch instead of
 * `bothThemes`.
 */
const withTheme: Decorator = (Story, context) => (
  <ThemeShell
    story={<Story />}
    theme={(pluckThemeFromContext(context) as ThemeName) || DEFAULT_THEME}
    sideBySide={context.parameters.bothThemes === true}
  />
);

const preview: Preview = {
  decorators: [withTheme],
  initialGlobals: {
    theme: DEFAULT_THEME,
  },
  parameters: {
    // The theme owns the ground; a separate background picker would just fight it.
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: [
          "Foundation",
          [
            "Anchor",
            "Color",
            "Typography",
            "Layout",
            "Surfaces",
            "Motion",
            "Icons",
          ],
          "Components",
          "*",
        ],
      },
    },
    // The decorator paints the surface and supplies the padding.
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        mobile: {
          name: "Mobile · 390",
          styles: { width: "390px", height: "844px" },
          type: "mobile",
        },
        tablet: {
          name: "Tablet · 768",
          styles: { width: "768px", height: "1024px" },
          type: "tablet",
        },
        desktop: {
          name: "Desktop · 1280",
          styles: { width: "1280px", height: "800px" },
          type: "desktop",
        },
        wide: {
          name: "Wide · 1536",
          styles: { width: "1536px", height: "960px" },
          type: "desktop",
        },
      },
    },
    a11y: {
      // 'error' fails the Vitest run on a violation. Deliberate: a contrast
      // failure in this project is a palette bug, and the whole point of the
      // solved token values is that they hold. Downgrade to 'todo' only with a
      // reason.
      test: "error",
    },
  },
  tags: ["autodocs"],
};

export default preview;
