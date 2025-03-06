import { Promise, SummarizeResult, UserProfile } from "./type";

export const summarize = (
  promiseList: Promise[],
  userId: string
): SummarizeResult => {
  const total = promiseList.length;
  const completed = promiseList.filter((p) => p.completedAt !== null).length;
  const active = promiseList.filter(
    (p) => p.completedAt === null && p.canceledAt === null
  ).length;
  const sent = promiseList.filter((p) => p.sender.id === userId).length;
  const friends =
    promiseList.length === 0
      ? []
      : (promiseList
          .map((p) => p.receiver)
          .filter((p) => p !== null && p.id !== userId) as UserProfile[]);

  const result: SummarizeResult = {
    total,
    completed,
    active,
    sent,
    friends,
  };
  return result;
};
