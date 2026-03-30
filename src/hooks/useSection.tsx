import { useInView } from "react-intersection-observer";

export function useSection(id: string) {
  const { ref, inView } = useInView({
    threshold: 0.3,
  });

  return { ref, inView, id };
}
