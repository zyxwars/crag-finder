import { createContext } from "react";
import { CragWithPermissions } from "types/utils";

// TODO: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509#issuecomment-382213106
export const CragContext = createContext<CragWithPermissions>();
