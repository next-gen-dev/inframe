// import { SvgIconProps } from "@mui/material";
// import { ElementType } from "react";

export type IconDef =
    | {
          type: "image";
          src: string;
      }
    | {
          type: "emoji";
          value: string;
      }
    // | {
    //       type: "component";
    //       component: ElementType<SvgIconProps>;
    //   }
    | {
          type: "color";
          value: string;
      };

export function imageIcon(src: string): IconDef {
    return {
        type: "image",
        src,
    };
}

// export function componentIcon(component: ElementType<SvgIconProps>): IconDef {
//     return {
//         type: "component",
//         component,
//     };
// }
export function colorIcon(color: string): IconDef {
    return {
        type: "color",
        value: color,
    };
}

export function emojiIcon(emoji: string): IconDef {
    return {
        type: "emoji",
        value: emoji,
    };
}
