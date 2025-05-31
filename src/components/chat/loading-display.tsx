import BouncingBallsLoading from '../icons/animated/bouncing-balls';

export default function LoadingDisplay() {
  // return <span className="w-fit text-secondary-foreground px-4 animate-pulse">Loading...</span>;

  return <BouncingBallsLoading className="h-8 w-8 text-secondary-foreground animate-pulse" />;
}
