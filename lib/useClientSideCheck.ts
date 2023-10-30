import { useEffect, useState } from "react";

function useClientSideCheck(checkFunction: () => boolean) {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    setStatus(checkFunction());
  }, [checkFunction]);

  return status;
}

export default useClientSideCheck;
