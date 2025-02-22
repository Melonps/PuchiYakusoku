import { extendTheme, UsageTheme } from "@yamada-ui/react";
// import { styles } from './styles'
// import { components } from './components'
import { tokens } from "./tokens";
import { semantics } from "./semantics";

const customTheme: UsageTheme = {
  // styles,
  // components,
  // ...tokens,
  semantics,
  ...tokens,
};

export const theme = extendTheme(customTheme)();
