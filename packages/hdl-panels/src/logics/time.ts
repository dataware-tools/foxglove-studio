import { Time } from "@foxglove/studio";

export const unixTimeToFoxgloveTime = (unixtime: number): Time => {
  const sec = Math.trunc(unixtime);
  const nsec = Math.trunc((unixtime - sec) * 10 ** 9);
  return { sec, nsec };
};

export const foxgloveTimeToUnixTime = (foxGloveTime: Time): number => {
  return foxGloveTime.sec + foxGloveTime.nsec * 10 ** -9;
};
