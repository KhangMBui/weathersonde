import { useEffect } from "react";
import { useRouter, useRootNavigationState } from "expo-router";

export default function Index() {
  const router = useRouter();
  const navigationState = useRootNavigationState(); // Check if Router is ready

  useEffect(() => {
    if (navigationState?.key) {
      // Ensure Router is mounted before navigating
      router.replace("/home");
    }
  }, [navigationState?.key]);

  return null; // No UI needed
}
