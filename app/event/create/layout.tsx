import React, { Suspense } from "react";

import { ReactNode } from "react";
import LoadingComponent from "./loading";

const Loading = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={<LoadingComponent />}>{children}</Suspense>;
};

export default Loading;
