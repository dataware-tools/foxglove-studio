import { Time } from "@foxglove/studio";

export const unixtimeToFoxgloveTime = (unixtime: number): Time => {
  const sec = Math.trunc(unixtime);
  const nsec = Math.trunc((unixtime - sec) * 10 ** 9);
  return { sec, nsec };
};

export const foxgloveTimeToUnixtime = (foxGloveTime: Time): number => {
  return foxGloveTime.sec + foxGloveTime.nsec * 10 ** -9;
};
