import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum } from '../util/fp';

export class Solution extends BaseSolution {
    description = `

    `;

    public solvePart1(lines: Input): string {
        const rounds = lines
            .map(parseHand)
            .map((handStruct) => ({
                ...handStruct,
                type: calculateHandType(handStruct.histogram),
            }))
            .sort(roundComparator);

        // rounds are sorted in descending value
        // console.log(rounds);

        return sum(
            rounds.reverse().map(({ bid }, roundIndex) => bid * (roundIndex + 1))
        ).toString();
    }

    public solvePart2(lines: Input): string {
        const rounds = lines
            .map(parseHand)
            .map((handStruct) => ({
                ...handStruct,
                type: optimizeHandType(handStruct.histogram),
            }))
            .sort(roundComparator2);

        // rounds are sorted in descending value
        // console.log(rounds);

        return sum(
            rounds.reverse().map(({ bid }, roundIndex) => bid * (roundIndex + 1))
        ).toString();
    }
}

type HandStruct = {
    /** Cards in hand, original order */
    cardsInHand: string[];
    histogram: Histogram;
    bid: number;
    type: HandType;
};

const parseHand = (line: string): HandStruct => {
    const cardsInHand = line.slice(0, 5).split('');

    const histogram: Histogram = cardsInHand.reduce((acc, current) => {
        if (acc[current] >= 0) acc[current] += 1;
        else acc[current] = 1;
        return acc;
    }, {} as Histogram);

    const bid = parseInt(line.slice(6));

    return {
        cardsInHand,
        histogram,
        bid,
        type: 'HIGH_CARD',
    };
};

const calculateHandType = (histogram: Histogram): HandType => {
    const nGroups = Object.keys(histogram).length;
    const gSizes = Object.values(histogram);

    if (nGroups === 1) return 'FIVE_OF_A_KIND';
    else if (nGroups === 2 && gSizes.includes(4)) return 'FOUR_OF_A_KIND';
    else if (nGroups === 2 && gSizes.includes(3) && gSizes.includes(2)) return 'FULL_HOUSE';
    else if (gSizes.includes(3)) return 'THREE_OF_A_KIND';
    else if (nGroups === 3 && gSizes.filter((s) => s === 2).length === 2) return 'TWO_PAIR';
    else if (gSizes.includes(2)) return 'ONE_PAIR';
    else return 'HIGH_CARD';
};

const optimizeHandType = (histogram: Histogram): HandType => {
    const originalHandType = calculateHandType(histogram);
    const nGroups = Object.keys(histogram).length;
    const gSizes = Object.values(histogram);
    const jCount = histogram.J;
    if (!jCount) return originalHandType;
    // We got jokers, time to party
    else if (jCount === 5) return 'FIVE_OF_A_KIND';
    // similarly, 4 jokers means that we can make a 5 of a kind by matching the remaining card
    else if (jCount === 4) return 'FIVE_OF_A_KIND';
    else if (jCount === 3) {
        // two possibilities: other two cards are the same (make five of a kind)
        if (nGroups === 2) return 'FIVE_OF_A_KIND';
        // or, other two cards are different (make four)
        else return 'FOUR_OF_A_KIND';
    } else if (jCount === 2) {
        // if the remaining cards are a triple, make 5 of a kind
        if (nGroups === 2) return 'FIVE_OF_A_KIND';
        // can make four of a kind if there is a pair of other cards already
        else if (nGroups === 3) return 'FOUR_OF_A_KIND';
        // if the other three cards are all different, we can make a triple
        else return 'THREE_OF_A_KIND';
    } else if (jCount === 1) {
        if (gSizes.includes(4)) return 'FIVE_OF_A_KIND';
        else if (gSizes.includes(3)) return 'FOUR_OF_A_KIND';
        // if there are two pairs, make a full house
        else if (gSizes.filter((g) => g === 2).length === 2) return 'FULL_HOUSE';
        else if (gSizes.includes(2)) return 'THREE_OF_A_KIND';
        else return 'ONE_PAIR';
    }
    throw new Error('ran off the end', histogram);
};

type Histogram = { [key: string]: number };

type HandType =
    | 'FIVE_OF_A_KIND'
    | 'FOUR_OF_A_KIND'
    | 'FULL_HOUSE'
    | 'THREE_OF_A_KIND'
    | 'TWO_PAIR'
    | 'ONE_PAIR'
    | 'HIGH_CARD';

// Lower is better
const HandValue: Record<HandType, number> = {
    FIVE_OF_A_KIND: 0,
    FOUR_OF_A_KIND: 1,
    FULL_HOUSE: 2,
    THREE_OF_A_KIND: 3,
    TWO_PAIR: 4,
    ONE_PAIR: 5,
    HIGH_CARD: 6,
};

const CARDS = 'AKQJT98765432'.split('');
const valueOfCard = (card: string): number => CARDS.indexOf(card);
const cardValueComparator = (a: string, b: string): number => valueOfCard(a) - valueOfCard(b);
const handValueComparator = (a: HandType, b: HandType): number => HandValue[a] - HandValue[b];
const roundComparator = (a: HandStruct, b: HandStruct): number => {
    // first, compare hand type
    const handTypeComparison = handValueComparator(a.type, b.type);
    if (handTypeComparison !== 0) return handTypeComparison;

    // if tied, move on to comparing card values in order
    for (let i = 0; i < 5; i++) {
        const cardComparison = cardValueComparator(a.cardsInHand[i], b.cardsInHand[i]);
        if (cardComparison !== 0) return cardComparison;
    }
    return 0;
};

const CARDS2 = 'AKQT98765432J'.split('');
const valueOfCard2 = (card: string): number => CARDS2.indexOf(card);
const cardValueComparator2 = (a: string, b: string): number => valueOfCard2(a) - valueOfCard2(b);
const roundComparator2 = (a: HandStruct, b: HandStruct): number => {
    // first, compare hand type
    const handTypeComparison = handValueComparator(a.type, b.type);
    if (handTypeComparison !== 0) return handTypeComparison;

    // if tied, move on to comparing card values in order
    for (let i = 0; i < 5; i++) {
        const cardComparison = cardValueComparator2(a.cardsInHand[i], b.cardsInHand[i]);
        if (cardComparison !== 0) return cardComparison;
    }
    return 0;
};
