import { BaseSolution, Input } from '../solution';

export class Solution extends BaseSolution {
    description = `
    --- Day 4: Repose Record ---
    You've sneaked into another supply closet - this time, it's across from the prototype suit manufacturing lab. You need to sneak inside and
    fix the issues with the suit, but there's a guard stationed outside the lab, so this is as close as you can safely get.
    
    As you search the closet for anything that might help, you discover that you're not the first person to want to sneak in. Covering the
    walls, someone has spent an hour starting every midnight for the past few months secretly observing this guard post! They've been writing
    down the ID of the one guard on duty that night - the Elves seem to have decided that one guard was enough for the overnight shift - as well
    as when they fall asleep or wake up while at their post (your puzzle input).
    
    For example, consider the following records, which have already been organized into chronological order:
    
    [1518-11-01 00:00] Guard #10 begins shift
    [1518-11-01 00:05] falls asleep
    [1518-11-01 00:25] wakes up
    [1518-11-01 00:30] falls asleep
    [1518-11-01 00:55] wakes up
    [1518-11-01 23:58] Guard #99 begins shift
    [1518-11-02 00:40] falls asleep
    [1518-11-02 00:50] wakes up
    [1518-11-03 00:05] Guard #10 begins shift
    [1518-11-03 00:24] falls asleep
    [1518-11-03 00:29] wakes up
    [1518-11-04 00:02] Guard #99 begins shift
    [1518-11-04 00:36] falls asleep
    [1518-11-04 00:46] wakes up
    [1518-11-05 00:03] Guard #99 begins shift
    [1518-11-05 00:45] falls asleep
    [1518-11-05 00:55] wakes up
    Timestamps are written using year-month-day hour:minute format. The guard falling asleep or waking up is always the one whose shift most
    recently started. Because all asleep/awake times are during the midnight hour (00:00 - 00:59), only the minute portion (00 - 59) is relevant
    for those events.
    
    Visually, these records show that the guards are asleep at these times:
    
    Date   ID   Minute
                000000000011111111112222222222333333333344444444445555555555
                012345678901234567890123456789012345678901234567890123456789
    11-01  #10  .....####################.....#########################.....
    11-02  #99  ........................................##########..........
    11-03  #10  ........................#####...............................
    11-04  #99  ....................................##########..............
    11-05  #99  .............................................##########.....
    The columns are Date, which shows the month-day portion of the relevant day; ID, which shows the guard on duty that day; and Minute, which
    shows the minutes during which the guard was asleep within the midnight hour. (The Minute column's header shows the minute's ten's digit in
    the first row and the one's digit in the second row.) Awake is shown as ., and asleep is shown as #.
    
    Note that guards count as asleep on the minute they fall asleep, and they count as awake on the minute they wake up. For example, because
    Guard #10 wakes up at 00:25 on 1518-11-01, minute 25 is marked as awake.
    
    If you can figure out the guard most likely to be asleep at a specific time, you might be able to trick that guard into working tonight so
    you can have the best chance of sneaking in. You have two strategies for choosing the best guard/minute combination.
    
    Strategy 1: Find the guard that has the most minutes asleep. What minute does that guard spend asleep the most?
    
    In the example above, Guard #10 spent the most minutes asleep, a total of 50 minutes (20+25+5), while Guard #99 only slept for a total of 30
    minutes (10+10+10). Guard #10 was asleep most during minute 24 (on two days, whereas any other minute the guard was asleep was only seen on
      one day).
    
    While this example listed the entries in chronological order, your entries are in the order you found them. You'll need to organize them
    before they can be analyzed.
    
    What is the ID of the guard you chose multiplied by the minute you chose? (In the above example, the answer would be 10 * 24 = 240.)
    
    
    --- Part Two ---
    Strategy 2: Of all guards, which guard is most frequently asleep on the same minute?
    
    In the example above, Guard #99 spent minute 45 asleep more than any other guard or minute - three times in total. (In all other cases, any
    guard spent any minute asleep at most twice.)
    
    What is the ID of the guard you chose multiplied by the minute you chose? (In the above example, the answer would be 99 * 45 = 4455.)`;

    solvePart1(lines: Input): string {
        const guardMap = lines
            // parse into entry objects
            .map(parseEntryFromLine)

            // sort chronologically
            .sort(entryComparator)

            // cluster chronological naps under each guard
            .reduce(consolidateShiftsByGuardReducer, { entries: [] })
            .entries // consolidate all shifts and naps under each guard
            .reduce(consolidateNapsByGuardReducer, {});

        const guards = Object.values(guardMap).map((g: any) => ({
            ...g,
            minutesNapped: calculateTotalMinutesNapped(g.naps),
        }));

        const [laziestGuard] = guards
            .sort((g1, g2) => g2.minutesNapped - g1.minutesNapped)
            .slice(0, 1);

        const napSchedule = calculateNapSchedule(laziestGuard.naps);

        // Compute minute where the guard most often sleeps
        const bestMinute = calculateMinuteMostAsleep(napSchedule);

        const result = laziestGuard.id * bestMinute;

        return result.toString();
    }

    solvePart2(lines: Input): string {
        // Gives incorrect answers in Node 10 but correct answers in Node 11?!
        const guardMap = lines
            // parse into entry objects
            .map(parseEntryFromLine)

            // sort chronologically
            .sort(entryComparator)

            // cluster chronological naps under each guard
            .reduce(consolidateShiftsByGuardReducer, { entries: [] })
            .entries // consolidate all shifts and naps under each guard
            .reduce(consolidateNapsByGuardReducer, {});

        const [sleepiestGuardAtMinute] = Object.values(guardMap)
            .map((guard: any) => ({ ...guard, schedule: calculateNapSchedule(guard.naps) }))
            .map((guard: any) => ({
                ...guard,
                minuteMostAsleep: calculateMinuteMostAsleep(guard.schedule),
            }))
            .sort(sleepiestMinuteComparator)
            .slice(0, 1);

        const result = sleepiestGuardAtMinute.id * sleepiestGuardAtMinute.minuteMostAsleep;

        return result.toString();
    }
}

const lineRegex = /^\[\d+-(\d{2})-(\d{2})\s(\d{2}):(\d{2})\]\s([\w\s#]+)$/;
const guardIdRegex = /^.*#(\d+).*$/;

function parseEntryFromLine(line) {
    const matches = lineRegex.exec(line) || [];
    matches.shift();
    const [month, day, hour, minute] = matches.slice(0, 4).map(Number);
    const [message] = matches.slice(-1);
    const event: any = {};
    if (guardIdRegex.test(message)) {
        event.type = 'b';
        const messageMatches = guardIdRegex.exec(message) || [];
        messageMatches.shift();
        const [guardId] = messageMatches;
        event.guardId = Number(guardId);
    } else if (message === 'falls asleep') {
        event.type = 's';
    } else if (message === 'wakes up') {
        event.type = 'w';
    }

    return {
        month,
        day,
        hour,
        minute,
        ...event,
    };
}

function entryComparator(e1, e2) {
    let comparator = 0;
    if (e1.month !== e2.month) {
        comparator = e1.month - e2.month;
    } else if (e1.day !== e2.day) {
        comparator = e1.day - e2.day;
    } else if (e1.hour !== e2.hour) {
        comparator = e1.hour - e2.hour;
    } else if (e1.minute !== e2.minute) {
        comparator = e1.minute - e2.minute;
    }

    return comparator;
}

function consolidateShiftsByGuardReducer(acc, entry, idx, src) {
    const { entries } = acc;
    let { currentGuard } = acc;

    if (entry.type === 'b') {
        // begin shift
        if (currentGuard) {
            // We have encountered a new guard entry - append currentGuard to entries and set a new currentGuard
            entries.push({ id: currentGuard.id, naps: currentGuard.naps });
        }
        currentGuard = { id: entry.guardId, naps: [] };
    } else if (entry.type === 's') {
        // fall asleep
        currentGuard.currentNap = { start: entry.minute };
    } else if (entry.type === 'w') {
        // wake up
        currentGuard.naps.push({ ...currentGuard.currentNap, end: entry.minute });
        delete currentGuard.currentNap;
    }

    if (idx === src.length - 1) {
        // Handle the last line by appending the record
        entries.push({ id: currentGuard.id, naps: currentGuard.naps });
    }

    return { entries, currentGuard };
}

function consolidateNapsByGuardReducer(guards, guard) {
    const newGuards = guards;

    if (!newGuards[guard.id]) {
        newGuards[guard.id] = guard;
    } else {
        const existingGuard = guards[guard.id];
        guard.naps.forEach((nap) => existingGuard.naps.push(nap));

        newGuards[guard.id] = existingGuard;
    }

    return newGuards;
}

function calculateTotalMinutesNapped(naps) {
    return naps.reduce((acc, nap) => acc + nap.end - nap.start, 0);
}

function calculateNapSchedule(naps, existingSchedule?) {
    const schedule = existingSchedule || Array(60).fill(0);

    naps.forEach(({ start, end }) => {
        for (let minute = start; minute < end; minute += 1) {
            schedule[minute] += 1;
        }
    });

    return schedule;
}

function calculateMinuteMostAsleep(schedule) {
    return schedule.reduce(
        ({ index, maxCount }, curCount, i) =>
            curCount > maxCount ? { index: i, maxCount: curCount } : { index, maxCount },
        { maxCount: 0 }
    ).index;
}

function sleepiestMinuteComparator(g1, g2) {
    return g2.minuteMostAsleep - g1.minuteMostAsleep;
}
