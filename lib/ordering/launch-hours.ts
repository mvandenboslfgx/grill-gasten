/**
 * Bevestigde launch-kandidaat openingstijden.
 * Worden NIET actief zolang orderingConfig.openWeekdays leeg is /
 * orderingEnabled false. Activation-PR zet weekdays + flags.
 */

export type DayWindow = {
  pickupStart: string;
  pickupEnd: string;
  deliveryStart: string;
  deliveryEnd: string;
};

/** ISO weekday: 0 = zondag … 6 = zaterdag. null = gesloten. */
export type LaunchHoursByWeekday = Record<number, DayWindow | null>;

export const launchHoursCandidate = {
  timezone: "Europe/Amsterdam" as const,
  /**
   * Kandidaat-weekdagen bij activatie: vr / za / zo.
   * openWeekdays blijft [] tot activation-PR.
   */
  candidateOpenWeekdays: [5, 6, 0] as number[],
  byWeekday: {
    0: {
      // zondag
      pickupStart: "16:30",
      pickupEnd: "21:00",
      deliveryStart: "17:00",
      deliveryEnd: "20:30",
    },
    1: null,
    2: null,
    3: null,
    4: null,
    5: {
      // vrijdag
      pickupStart: "17:00",
      pickupEnd: "22:00",
      deliveryStart: "17:00",
      deliveryEnd: "21:30",
    },
    6: {
      // zaterdag
      pickupStart: "16:30",
      pickupEnd: "22:00",
      deliveryStart: "17:00",
      deliveryEnd: "21:30",
    },
  } satisfies LaunchHoursByWeekday,
};

export function getLaunchDayWindow(isoWeekday: number): DayWindow | null {
  if (isoWeekday < 0 || isoWeekday > 6) return null;
  const key = isoWeekday as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  return launchHoursCandidate.byWeekday[key] ?? null;
}

export function launchHoursAreValid(): boolean {
  const days = launchHoursCandidate.candidateOpenWeekdays;
  if (days.length === 0) return false;
  return days.every((d) => {
    const w = getLaunchDayWindow(d);
    if (!w) return false;
    return (
      Boolean(w.pickupStart && w.pickupEnd && w.deliveryStart && w.deliveryEnd)
    );
  });
}
